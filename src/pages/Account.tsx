import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import DiagonalRule from "@/components/primitives/DiagonalRule";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { useAuth } from "@/context/AuthContext";
import { Moonbase } from "@/lib/moonbase";

/* ------------------------------------------------------------------ */
/* Logged-out view — opens the Moonbase sign-in / sign-up modal.       */
/* ------------------------------------------------------------------ */

const LoggedOut = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const open = () => {
    if (mode === "login") Moonbase.sign_in();
    else Moonbase.sign_up();
  };

  return (
    <Section pad="xl" className="relative overflow-hidden">
      <DiagonalRule top="55%" />
      <Container width="wide">
        <div className="md:pl-8 lg:pl-16 max-w-[480px]">
          <Reveal variant="up" {...MOTION.page.eyebrow}>
            <Eyebrow accent className="mb-8">// account</Eyebrow>
          </Reveal>
          <h1 className="text-[48px] md:text-[56px] leading-[1.05] text-[color:var(--ink)] mb-4">
            <Reveal
              key={mode}
              as="span"
              variant="up"
              className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              {mode === "login" ? "sign in" : "create account"}
            </Reveal>
          </h1>
          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-sans text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] mb-12">
              {mode === "login"
                ? "access your licenses and downloads."
                : "set up an entropia audio account."}
            </p>
          </Reveal>

          <button
            type="button"
            onClick={open}
            className="group inline-flex items-baseline gap-2 self-start text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
          >
            <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[200ms] ease-editorial">
              {mode === "login" ? "sign in" : "create account"}
            </span>
            <span className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="block mt-10 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
          >
            {mode === "login"
              ? "no account? create one →"
              : "already have an account? sign in →"}
          </button>
        </div>
      </Container>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Logged-in view — licenses, orders, and settings all live behind the */
/* Moonbase account modal (the embedded SDK doesn't surface them as     */
/* data), so the site delegates rather than half-rendering them.        */
/* ------------------------------------------------------------------ */

const AccountHeader = ({ email, onSignOut }: { email: string; onSignOut: () => void }) => (
  <Reveal variant="up" {...MOTION.page.eyebrow} className="flex items-start justify-between gap-6 flex-wrap mb-20">
    <div>
      <Eyebrow accent className="mb-3">// signed in as</Eyebrow>
      <p className="font-mono font-medium text-[26px] md:text-[32px] tracking-[0.02em] text-[color:var(--ink)] selectable">
        {email}
      </p>
    </div>
    <button
      type="button"
      onClick={onSignOut}
      className="group inline-flex items-baseline gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial md:pt-7"
    >
      <span className="link-draw">sign out</span>
      <span className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-0.5">→</span>
    </button>
  </Reveal>
);

/** One labelled CTA that opens the Moonbase account modal. All three intents
 *  land in the same modal (Moonbase exposes only `view_account`); the labels
 *  exist so the user's mental model — "licenses live there, orders live there" —
 *  stays explicit. */
const MoonbaseAccountLink = ({
  eyebrow,
  description,
  cta,
}: {
  eyebrow: string;
  description: string;
  cta: string;
}) => (
  <section className="mb-16">
    <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
    <p className="font-sans text-[15px] leading-[1.7] text-[color:var(--text-secondary)] max-w-[52ch] mb-6">
      {description}
    </p>
    <button
      type="button"
      onClick={() => Moonbase.view_account()}
      className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
    >
      <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[200ms] ease-editorial">
        {cta}
      </span>
      <span className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
    </button>
  </section>
);

const LoggedIn = () => {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <Section pad="xl" className="relative overflow-hidden">
      <DiagonalRule top="280px" />
      <Container width="wide">
        <div className="md:pl-8 lg:pl-16 max-w-[1080px]">
          <AccountHeader email={user.email} onSignOut={signOut} />

          <MoonbaseAccountLink
            eyebrow="licenses & downloads"
            description="view your active licenses, reveal license keys, and download installers in your moonbase account."
            cta="open licenses"
          />

          <MoonbaseAccountLink
            eyebrow="orders"
            description="view your order history, receipts, and payment methods in your moonbase account."
            cta="open orders"
          />

          <MoonbaseAccountLink
            eyebrow="account settings"
            description="change your email, password, or marketing preferences in your moonbase account."
            cta="manage account"
          />
        </div>
      </Container>
    </Section>
  );
};

const Account = () => {
  const { isAuthed } = useAuth();

  return <SiteLayout>{isAuthed ? <LoggedIn /> : <LoggedOut />}</SiteLayout>;
};

export default Account;

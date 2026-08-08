import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
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
    <div className="max-w-[520px]">
      <h1
        className="font-editorial italic text-[clamp(38px,4.6vw,56px)] leading-[1.05] tracking-[-0.015em] text-[color:var(--ink)] m-0 mb-4"
        style={{ fontWeight: 470 }}
      >
        <Reveal
          key={mode}
          as="span"
          variant="up"
          className="inline-block"
          delay={MOTION.page.headline1.delay}
          duration={MOTION.duration.instant}
        >
          {mode === "login" ? "sign in" : "create account"}
        </Reveal>
      </h1>

      <Reveal variant="up" {...MOTION.page.body0}>
        <p className="font-mono text-[14.5px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] m-0 mb-11">
          {mode === "login"
            ? "access your licenses and downloads."
            : "set up an entropia audio account."}
        </p>
      </Reveal>

      <button type="button" onClick={open} className="link-ink">
        <span>{mode === "login" ? "sign in" : "create account"}</span>
        <span aria-hidden="true">→</span>
      </button>

      <div className="mt-9">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="font-mono font-semibold text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-3)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-raw)]"
        >
          {mode === "login"
            ? "no account? create one →"
            : "already have an account? sign in →"}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Logged-in view — licenses, orders, and settings all live behind the */
/* Moonbase account modal (the embedded SDK doesn't surface them as    */
/* data), so the site delegates rather than half-rendering them.       */
/* ------------------------------------------------------------------ */

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
  <section className="border-t border-hairline pt-7 mb-12">
    <div className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-3)] mb-3.5">
      {eyebrow}
    </div>
    <p className="font-mono text-[14px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[52ch] m-0 mb-4">
      {description}
    </p>
    <button type="button" onClick={() => Moonbase.view_account()} className="link-ink">
      <span>{cta}</span>
      <span aria-hidden="true">→</span>
    </button>
  </section>
);

const LoggedIn = () => {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-[920px]">
      <Reveal
        variant="up"
        {...MOTION.page.eyebrow}
        className="flex items-start justify-between gap-6 flex-wrap mb-16"
      >
        <p className="font-mono font-medium text-[clamp(20px,2.4vw,30px)] tracking-[0.02em] text-[color:var(--ink)] selectable m-0">
          {user.email}
        </p>
        <button
          type="button"
          onClick={signOut}
          className="font-mono font-semibold text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-3)] pt-5 transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-raw)]"
        >
          sign out →
        </button>
      </Reveal>

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
  );
};

const Account = () => {
  const { isAuthed } = useAuth();

  return (
    <SiteLayout>
      <section className="relative px-[3.2vw] pt-[84px] pb-[110px] min-h-[56vh]">
        {isAuthed ? <LoggedIn /> : <LoggedOut />}
      </section>
    </SiteLayout>
  );
};

export default Account;

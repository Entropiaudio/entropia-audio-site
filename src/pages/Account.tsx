import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { useAuth } from "@/context/AuthContext";
import { Moonbase } from "@/lib/moonbase";
import { copy } from "@/copy";

/* ------------------------------------------------------------------ */
/* Logged-out view — opens the Moonbase sign-in / sign-up modal.       */
/* ------------------------------------------------------------------ */

const LoggedOut = () => {
  const c = copy.account;
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
          {mode === "login" ? c.signInTitle : c.signUpTitle}
        </Reveal>
      </h1>

      <Reveal variant="up" {...MOTION.page.body0}>
        <p className="font-mono text-fluid-14.5 leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] m-0 mb-11">
          {mode === "login" ? c.signInBody : c.signUpBody}
        </p>
      </Reveal>

      <button type="button" onClick={open} className="link-ink">
        <span>{mode === "login" ? c.signInCta : c.signUpCta}</span>
        <span aria-hidden="true">→</span>
      </button>

      <div className="mt-9">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="font-mono font-semibold text-fluid-11 uppercase tracking-[0.18em] text-[color:var(--ink-3)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-ink)]"
        >
          {mode === "login" ? c.signInSwitch : c.signUpSwitch}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Logged-in view. Licenses, orders, and settings all live behind the  */
/* same Moonbase account modal (the SDK exposes only `view_account`),  */
/* so the page offers exactly one door in — three labelled links that  */
/* all opened the same modal just made people pick between identical   */
/* options.                                                            */
/* ------------------------------------------------------------------ */

const LoggedIn = () => {
  const c = copy.account;
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-[920px]">
      <Reveal
        variant="up"
        {...MOTION.page.eyebrow}
        className="flex items-start justify-between gap-6 flex-wrap mb-16"
      >
        <h1 className="font-mono font-medium text-[clamp(20px,2.4vw,30px)] tracking-[0.02em] text-[color:var(--ink)] selectable m-0">
          {user.email}
        </h1>
        <button
          type="button"
          onClick={signOut}
          className="font-mono font-semibold text-fluid-11 uppercase tracking-[0.18em] text-[color:var(--ink-3)] pt-5 transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-ink)]"
        >
          {c.signOut}
        </button>
      </Reveal>

      <section className="rule-top-fade pt-7">
        <h2 className="font-mono font-semibold text-fluid-10 uppercase tracking-[0.2em] text-[color:var(--ink-3)] m-0 mb-3.5">
          {c.dashboardEyebrow}
        </h2>
        <p className="font-mono text-fluid-14 leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[52ch] m-0 mb-4">
          {c.dashboardBody}
        </p>
        <button type="button" onClick={() => Moonbase.view_account()} className="link-ink">
          <span>{c.dashboardCta}</span>
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  );
};

const Account = () => {
  usePageTitle("account");
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

import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import { MOTION } from "@/components/motion/timing";
import { toast } from "@/hooks/use-toast";
import { useAuth, License, Order } from "@/context/AuthContext";
import { isMoonbaseEnabled, Moonbase } from "@/lib/moonbase";

const fieldClass =
  "bg-transparent border-b border-[color:var(--border-soft)] focus:border-[color:var(--accent-raw)] outline-none py-3 text-[15px] font-sans tracking-[0.005em] w-full transition-colors duration-[400ms] ease-editorial";

const labelClass =
  "text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]";

/** Only allow same-origin paths so `?next=https://evil.com` can't be used. */
const safeNext = (raw: string | null): string => {
  if (!raw) return "/account";
  // Reject protocol-relative ("//evil.com") and anything not starting with "/".
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/account";
  return raw;
};

/* ------------------------------------------------------------------ */
/* Logged-out view — branches on backend.                              */
/* ------------------------------------------------------------------ */

const LoggedOutMoonbase = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");

  const open = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "login") Moonbase.sign_in(email ? { email } : undefined);
    else Moonbase.sign_up(email ? { email } : undefined);
  };

  return (
    <Section pad="xl">
      <Container width="wide">
        <div className="md:pl-8 lg:pl-16 max-w-[480px]">
          <Reveal variant="up" {...MOTION.page.eyebrow}>
            <Eyebrow accent className="mb-8">// account</Eyebrow>
          </Reveal>
          <h1 className="font-display font-light text-[48px] md:text-[56px] leading-[1.05] tracking-[-0.02em] mb-4">
            <RevealWords
              key={mode}
              as="span"
              className="font-editorial italic font-normal tracking-[-0.015em]"
              {...MOTION.page.headline1}
              stagger={MOTION.stagger.word}
            >
              {mode === "login" ? "sign in" : "create account"}
            </RevealWords>
          </h1>
          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-sans text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] mb-12">
              {mode === "login"
                ? "access your licenses and downloads."
                : "set up an entropia audio account."}
            </p>
          </Reveal>

          <form onSubmit={open} className="flex flex-col gap-7">
            <label className="flex flex-col gap-3">
              <span className={labelClass}>email (optional, prefills the form)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>

            <button
              type="submit"
              className="group inline-flex items-baseline gap-2 self-start mt-4 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
            >
              <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                {mode === "login" ? "sign in" : "create account"}
              </span>
              <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-10 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
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

const LoggedOutLocal = () => {
  const { signIn, signUp } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get("next"));

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast({ title: "signed in." });
      } else {
        await signUp(email, password);
        toast({ title: "account created." });
      }
      navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section pad="xl">
      <Container width="wide">
        <div className="md:pl-8 lg:pl-16 max-w-[480px]">
          <Reveal variant="up" {...MOTION.page.eyebrow}>
            <Eyebrow accent className="mb-8">// account</Eyebrow>
          </Reveal>
          <h1 className="font-display font-light text-[48px] md:text-[56px] leading-[1.05] tracking-[-0.02em] mb-4">
            <RevealWords
              key={mode}
              as="span"
              className="font-editorial italic font-normal tracking-[-0.015em]"
              {...MOTION.page.headline1}
              stagger={MOTION.stagger.word}
            >
              {mode === "login" ? "sign in" : "create account"}
            </RevealWords>
          </h1>
          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-sans text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] mb-12">
              {mode === "login"
                ? "access your licenses and downloads."
                : "set up an entropia audio account."}
            </p>
          </Reveal>

          <form onSubmit={submit} className="flex flex-col gap-7">
            <label className="flex flex-col gap-3">
              <span className={labelClass}>email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-3">
              <span className={labelClass}>password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
              />
            </label>

            {error && (
              <p className="text-[13px] text-[color:var(--accent-raw)] font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group inline-flex items-baseline gap-2 self-start mt-4 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                {busy ? "…" : mode === "login" ? "sign in" : "create account"}
              </span>
              {!busy && (
                <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            className="mt-10 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
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

const LoggedOut = () => (isMoonbaseEnabled ? <LoggedOutMoonbase /> : <LoggedOutLocal />);

/* ------------------------------------------------------------------ */
/* Logged-in view — table layout shared, settings section branches.    */
/* ------------------------------------------------------------------ */

const LicenseRow = ({ license }: { license: License }) => {
  const [revealed, setRevealed] = useState(false);
  const masked = "••••-••••-••••-••••-" + license.key.slice(-4);
  return (
    <tr className="border-t border-hairline">
      <td className="py-5 pr-4 font-sans text-[15px] text-[color:var(--text-primary)]">{license.plugin}</td>
      <td className="py-5 pr-4 font-mono text-[13px] text-[color:var(--text-tertiary)]">{license.version}</td>
      <td className="py-5 pr-4 font-mono text-[13px]">
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial text-left tabular-nums"
          title={revealed ? "click to hide" : "click to reveal"}
        >
          {revealed ? license.key : masked}
        </button>
      </td>
      <td className="py-5 pr-4">
        {license.downloadUrl ? (
          <a
            href={license.downloadUrl}
            className="text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] border-b border-[color:var(--text-primary)] hover:border-[color:var(--accent-raw)] pb-0.5 transition-colors duration-[400ms] ease-editorial"
          >
            download
          </a>
        ) : (
          <span
            aria-disabled="true"
            title="installer coming soon"
            className="text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] opacity-60 cursor-not-allowed"
          >
            soon
          </span>
        )}
      </td>
      <td className="py-5 font-mono text-[13px] text-[color:var(--text-tertiary)] tabular-nums">{license.date}</td>
    </tr>
  );
};

const OrderRow = ({ order }: { order: Order }) => (
  <tr className="border-t border-hairline align-top">
    <td className="py-5 pr-4 font-mono text-[13px] tabular-nums text-[color:var(--text-secondary)]">{order.id}</td>
    <td className="py-5 pr-4 font-mono text-[13px] text-[color:var(--text-tertiary)] tabular-nums">
      {order.date.slice(0, 10)}
    </td>
    <td className="py-5 pr-4 text-[14px] font-sans">
      {order.items.map((it) => (
        <div key={`${order.id}:${it.slug}:${it.license}`} className="text-[color:var(--text-primary)]">
          {it.name}{" "}
          <span className="text-[color:var(--text-tertiary)] font-mono text-[12px]">
            × {it.quantity}
          </span>
        </div>
      ))}
    </td>
    <td className="py-5 pr-4 font-mono text-[13px] text-[color:var(--text-tertiary)] tabular-nums">
      ···{order.paymentLast4}
    </td>
    <td className="py-5 font-mono text-[14px] tabular-nums text-right text-[color:var(--text-primary)]">
      ${order.total.toFixed(2)}
    </td>
  </tr>
);

const tableHeadRow =
  "text-left text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]";

const SettingsLocal = () => {
  const { user, updateEmail, updatePassword } = useAuth();
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailBusy, setEmailBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  if (!user) return null;

  const onEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (emailBusy) return;
    setEmailError(null);
    setEmailBusy(true);
    try {
      const result = await updateEmail(newEmail);
      if (!result.ok) {
        setEmailError(result.error);
        return;
      }
      toast({ title: "email updated." });
    } finally {
      setEmailBusy(false);
    }
  };

  const onPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordBusy) return;
    if (!newPassword) return;
    setPasswordError(null);
    setPasswordBusy(true);
    try {
      const result = await updatePassword(newPassword);
      if (!result.ok) {
        setPasswordError(result.error);
        return;
      }
      setNewPassword("");
      toast({ title: "password updated." });
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <section>
      <Eyebrow className="mb-8">account settings</Eyebrow>
      <div className="grid md:grid-cols-2 gap-12 max-w-3xl">
        <form onSubmit={onEmailSubmit} className="flex flex-col gap-4">
          <label className={labelClass}>change email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            aria-invalid={emailError ? true : undefined}
            className={fieldClass}
          />
          {emailError && (
            <p className="text-[12px] text-[color:var(--accent-raw)] font-mono">{emailError}</p>
          )}
          <button
            type="submit"
            disabled={emailBusy}
            className="group inline-flex items-baseline gap-2 self-start mt-3 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[400ms] ease-editorial">
              {emailBusy ? "…" : "save"}
            </span>
          </button>
        </form>

        <form onSubmit={onPasswordSubmit} className="flex flex-col gap-4">
          <label className={labelClass}>change password</label>
          <input
            type="password"
            value={newPassword}
            placeholder="new password"
            minLength={6}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            aria-invalid={passwordError ? true : undefined}
            className={`${fieldClass} placeholder:text-[color:var(--text-tertiary)]`}
          />
          {passwordError && (
            <p className="text-[12px] text-[color:var(--accent-raw)] font-mono">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={passwordBusy}
            className="group inline-flex items-baseline gap-2 self-start mt-3 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[400ms] ease-editorial">
              {passwordBusy ? "…" : "save"}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

const SettingsMoonbase = () => (
  <section>
    <Eyebrow className="mb-8">account settings</Eyebrow>
    <p className="font-sans text-[15px] leading-[1.7] text-[color:var(--text-secondary)] max-w-[52ch] mb-8">
      change your email, password, or marketing preferences in the moonbase
      account panel.
    </p>
    <button
      type="button"
      onClick={() => Moonbase.view_account()}
      className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
    >
      <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[400ms] ease-editorial">
        manage account
      </span>
      <span className="transition-transform duration-[400ms] ease-editorial group-hover:translate-x-1">→</span>
    </button>
  </section>
);

const LoggedIn = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <Section pad="xl">
      <Container width="wide">
        <div className="md:pl-8 lg:pl-16 max-w-[1080px]">
          <Reveal variant="up" {...MOTION.page.eyebrow} className="flex items-start justify-between gap-6 flex-wrap mb-20">
            <div>
              <Eyebrow accent className="mb-3">// signed in as</Eyebrow>
              <p className="font-display font-light text-[28px] md:text-[36px] tracking-[-0.015em] text-[color:var(--text-primary)]">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="group inline-flex items-baseline gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial md:pt-7"
            >
              <span className="link-draw">sign out</span>
              <span className="transition-transform duration-[400ms] ease-editorial group-hover:translate-x-0.5">→</span>
            </button>
          </Reveal>

          <section className="mb-24">
            <Eyebrow className="mb-8">licenses</Eyebrow>
            {user.licenses.length === 0 ? (
              <p className="font-sans text-[15px] text-[color:var(--text-secondary)]">
                no licenses yet.{" "}
                <Link
                  to="/"
                  className="text-[color:var(--text-primary)] border-b border-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] hover:border-[color:var(--accent-raw)] pb-0.5 transition-colors duration-[400ms] ease-editorial"
                >
                  browse plugins →
                </Link>
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className={tableHeadRow}>
                      <th className="pb-5 pr-4 font-medium">plugin</th>
                      <th className="pb-5 pr-4 font-medium">version</th>
                      <th className="pb-5 pr-4 font-medium">license key</th>
                      <th className="pb-5 pr-4 font-medium">download</th>
                      <th className="pb-5 font-medium">purchased</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.licenses.map((l) => (
                      <LicenseRow key={l.key} license={l} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mb-24">
            <Eyebrow className="mb-8">orders</Eyebrow>
            {user.orders.length === 0 ? (
              <p className="font-sans text-[15px] text-[color:var(--text-secondary)]">no orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className={tableHeadRow}>
                      <th className="pb-5 pr-4 font-medium">order</th>
                      <th className="pb-5 pr-4 font-medium">date</th>
                      <th className="pb-5 pr-4 font-medium">items</th>
                      <th className="pb-5 pr-4 font-medium">card</th>
                      <th className="pb-5 font-medium text-right">total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.orders.map((o) => (
                      <OrderRow key={o.id} order={o} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {isMoonbaseEnabled ? <SettingsMoonbase /> : <SettingsLocal />}
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

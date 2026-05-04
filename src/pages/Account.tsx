import { FormEvent, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { toast } from "@/hooks/use-toast";
import { useAuth, License, Order } from "@/context/AuthContext";

const fieldClass =
  "bg-transparent border-b border-hairline focus:border-foreground outline-none py-2 text-base w-full";

const LoggedOut = () => {
  const { signIn, signUp } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get("next") || "/account";

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
    <div className="max-w-sm mx-auto px-6 py-24 md:py-40">
      <h1 className="text-2xl font-medium tracking-tight mb-2">
        {mode === "login" ? "sign in" : "create account"}
      </h1>
      <p className="text-sm text-foreground/60 mb-10">
        {mode === "login"
          ? "access your licenses and downloads."
          : "set up an entropia audio account."}
      </p>

      <form onSubmit={submit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>

        {error && <p className="text-sm text-destructive font-mono">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 px-5 py-3 bg-foreground text-background hover:bg-accent transition-colors text-sm self-start disabled:opacity-50"
        >
          {busy ? "…" : mode === "login" ? "sign in" : "create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
        }}
        className="mt-8 text-sm text-foreground/60 hover:text-accent transition-colors"
      >
        {mode === "login"
          ? "no account? create one →"
          : "already have an account? sign in →"}
      </button>
    </div>
  );
};

const LicenseRow = ({ license }: { license: License }) => {
  const [revealed, setRevealed] = useState(false);
  const masked = "••••-••••-••••-••••-" + license.key.slice(-4);
  return (
    <tr className="border-t border-hairline">
      <td className="py-4 pr-4">{license.plugin}</td>
      <td className="py-4 pr-4 font-mono text-sm text-foreground/60">{license.version}</td>
      <td className="py-4 pr-4 font-mono text-sm">
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="hover:text-accent transition-colors text-left"
          title={revealed ? "click to hide" : "click to reveal"}
        >
          {revealed ? license.key : masked}
        </button>
      </td>
      <td className="py-4 pr-4">
        <a
          href="#"
          className="underline underline-offset-4 hover:text-accent transition-colors text-sm"
        >
          download
        </a>
      </td>
      <td className="py-4 font-mono text-sm text-foreground/60">{license.date}</td>
    </tr>
  );
};

const OrderRow = ({ order }: { order: Order }) => (
  <tr className="border-t border-hairline align-top">
    <td className="py-4 pr-4 font-mono text-sm">{order.id}</td>
    <td className="py-4 pr-4 font-mono text-sm text-foreground/60">
      {order.date.slice(0, 10)}
    </td>
    <td className="py-4 pr-4 text-sm">
      {order.items.map((it) => (
        <div key={`${order.id}:${it.slug}:${it.license}`}>
          {it.name} <span className="text-foreground/50 font-mono text-xs">× {it.quantity} ({it.license})</span>
        </div>
      ))}
    </td>
    <td className="py-4 pr-4 font-mono text-sm text-foreground/60">···{order.paymentLast4}</td>
    <td className="py-4 font-mono text-sm text-right">${order.total.toFixed(2)}</td>
  </tr>
);

const LoggedIn = () => {
  const { user, signOut, updateEmail, updatePassword } = useAuth();
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-28">
      <div className="flex items-start justify-between gap-6 flex-wrap mb-16">
        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/50 font-mono mb-2">
            signed in as
          </p>
          <p className="text-xl md:text-2xl font-medium tracking-tight">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-sm text-foreground/60 hover:text-accent transition-colors"
        >
          sign out →
        </button>
      </div>

      <section className="mb-20">
        <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
          licenses
        </h2>
        {user.licenses.length === 0 ? (
          <p className="text-sm text-foreground/60">
            no licenses yet.{" "}
            <Link to="/" className="underline underline-offset-4 hover:text-accent transition-colors">
              browse plugins →
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-foreground/50 font-mono">
                  <th className="pb-4 pr-4 font-normal">plugin</th>
                  <th className="pb-4 pr-4 font-normal">version</th>
                  <th className="pb-4 pr-4 font-normal">license key</th>
                  <th className="pb-4 pr-4 font-normal">download</th>
                  <th className="pb-4 font-normal">purchased</th>
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

      <section className="mb-20">
        <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
          orders
        </h2>
        {user.orders.length === 0 ? (
          <p className="text-sm text-foreground/60">no orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-foreground/50 font-mono">
                  <th className="pb-4 pr-4 font-normal">order</th>
                  <th className="pb-4 pr-4 font-normal">date</th>
                  <th className="pb-4 pr-4 font-normal">items</th>
                  <th className="pb-4 pr-4 font-normal">card</th>
                  <th className="pb-4 font-normal text-right">total</th>
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

      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
          account settings
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateEmail(newEmail);
              toast({ title: "email updated." });
            }}
            className="flex flex-col gap-3"
          >
            <label className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
              change email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={fieldClass}
            />
            <button
              type="submit"
              className="self-start mt-2 text-sm px-4 py-2 border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              save
            </button>
          </form>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newPassword) return;
              updatePassword(newPassword);
              setNewPassword("");
              toast({ title: "password updated." });
            }}
            className="flex flex-col gap-3"
          >
            <label className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
              change password
            </label>
            <input
              type="password"
              value={newPassword}
              placeholder="new password"
              minLength={6}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${fieldClass} placeholder:text-foreground/30`}
            />
            <button
              type="submit"
              className="self-start mt-2 text-sm px-4 py-2 border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              save
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const Account = () => {
  const { isAuthed } = useAuth();

  return <SiteLayout>{isAuthed ? <LoggedIn /> : <LoggedOut />}</SiteLayout>;
};

export default Account;

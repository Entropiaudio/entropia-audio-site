import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  activeProvider,
  formatCard,
  formatExpiry,
  PaymentDetails,
  validatePayment,
} from "@/lib/payments";
import { toast } from "@/hooks/use-toast";

const TAX_RATE = 0.0;

const fieldClass =
  "bg-transparent border-b border-hairline focus:border-foreground outline-none py-2 text-base w-full";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user, isAuthed, attachOrder } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [details, setDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
    email: user?.email ?? "",
    country: "",
    postal: "",
  });

  useEffect(() => {
    if (items.length === 0 && !submitting) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate, submitting]);

  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const update = <K extends keyof PaymentDetails>(key: K, value: PaymentDetails[K]) =>
    setDetails((d) => ({ ...d, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthed) {
      toast({
        title: "sign in required.",
        description: "create an account or sign in to complete your purchase.",
      });
      navigate("/account?next=/checkout");
      return;
    }

    const validation = validatePayment(details);
    if (validation) {
      setError(validation);
      return;
    }

    setSubmitting(true);
    try {
      const result = await activeProvider.charge({ amount: total, items, payment: details });
      if (result.ok === false) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      attachOrder(result.order, result.licenses);
      clear();
      navigate(`/order/${result.order.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "payment failed.");
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-12">checkout</h1>

        {!isAuthed && (
          <div className="mb-10 border border-hairline p-5 text-sm">
            <span className="text-foreground/70">you&apos;ll need an account to receive licenses. </span>
            <Link
              to="/account?next=/checkout"
              className="underline underline-offset-4 hover:text-accent transition-colors"
            >
              sign in or create one →
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_360px] gap-12 md:gap-16">
          <form onSubmit={submit} className="flex flex-col gap-12">
            <section>
              <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
                contact
              </h2>
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                  email
                </span>
                <input
                  type="email"
                  required
                  value={details.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={fieldClass}
                />
              </label>
            </section>

            <section>
              <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
                payment
              </h2>
              <div className="grid gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                    name on card
                  </span>
                  <input
                    type="text"
                    required
                    value={details.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                    card number
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                    placeholder="4242 4242 4242 4242"
                    value={details.cardNumber}
                    onChange={(e) => update("cardNumber", formatCard(e.target.value))}
                    className={`${fieldClass} placeholder:text-foreground/30 font-mono`}
                  />
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                      expiry
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      required
                      placeholder="MM/YY"
                      value={details.expiry}
                      onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                      className={`${fieldClass} placeholder:text-foreground/30 font-mono`}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                      cvc
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={details.cvc}
                      onChange={(e) => update("cvc", e.target.value.replace(/\D+/g, ""))}
                      className={`${fieldClass} placeholder:text-foreground/30 font-mono`}
                    />
                  </label>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
                billing address
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-2 col-span-1">
                  <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                    country
                  </span>
                  <input
                    type="text"
                    required
                    value={details.country}
                    onChange={(e) => update("country", e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-2 col-span-1">
                  <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                    postal code
                  </span>
                  <input
                    type="text"
                    required
                    value={details.postal}
                    onChange={(e) => update("postal", e.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
            </section>

            {error && (
              <p className="text-sm text-destructive font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="self-start px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "processing…" : `pay $${total.toFixed(2)}`}
            </button>
            <p className="text-xs text-foreground/40 font-mono -mt-8">
              test cards: 4242 4242 4242 4242 succeeds · ending 0002 declined · 0069 insufficient funds
            </p>
          </form>

          <aside className="md:sticky md:top-28 self-start border-t md:border-t-0 md:border-l border-hairline md:pl-12 pt-10 md:pt-0">
            <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
              order summary
            </h2>
            <ul className="flex flex-col gap-4">
              {items.map((it) => (
                <li
                  key={`${it.slug}:${it.license}`}
                  className="flex items-baseline justify-between gap-4 text-sm"
                >
                  <div>
                    <div>{it.name}</div>
                    <div className="text-xs text-foreground/50 font-mono">
                      {it.license} · qty {it.quantity}
                    </div>
                  </div>
                  <div className="font-mono">${(it.price * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-hairline pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">tax</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-hairline">
                <span>total</span>
                <span className="font-mono text-base">${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Checkout;

// Checkout, branches by storefront backend.
//
// With Moonbase: this page becomes a thin mount point. We fire
// Moonbase.checkout() on mount, listen for CheckoutCompleted (→ /order/:id)
// and CheckoutClosed (→ /cart). The card form and validatePayment helpers
// below only run for the localStorage prototype.
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
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
import { isMoonbaseEnabled, Moonbase, MoonbaseEvent } from "@/lib/moonbase";

const TAX_RATE = 0.0;

const fieldClass =
  "bg-transparent border-b border-[color:var(--border-soft)] focus:border-[color:var(--accent-raw)] outline-none py-3 text-[15px] font-sans tracking-[0.005em] w-full transition-colors duration-[200ms] ease-editorial";

const labelClass =
  "text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]";

/* ------------------------------------------------------------------ */
/* Moonbase mount, opens the storefront checkout, waits for outcome.   */
/* ------------------------------------------------------------------ */

const MoonbaseCheckoutMount = () => {
  const { items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }
    Moonbase.checkout();

    Moonbase.on(MoonbaseEvent.CheckoutCompleted, ({ order }: { order: { id?: string } }) => {
      if (order?.id) navigate(`/order/${order.id}`, { replace: true });
      else navigate("/account", { replace: true });
    });
    Moonbase.on(MoonbaseEvent.CheckoutClosed, () => {
      // The user dismissed the Moonbase modal without completing. Return
      // them to the cart so they don't sit on an empty checkout shell.
      navigate("/cart", { replace: true });
    });
  }, [items.length, navigate]);

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[720px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">// checkout</Eyebrow>
            </Reveal>
            <h1 className="font-display font-light text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-10">
              <Reveal
                as="span"
                variant="up"
                className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
                delay={MOTION.page.headline1.delay}
                duration={MOTION.duration.instant}
              >
                opening checkout
              </Reveal>
            </h1>
            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="font-sans text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch]">
                if the checkout window doesn&apos;t appear, your browser may be
                blocking pop-ups.{" "}
                <button
                  type="button"
                  onClick={() => Moonbase.checkout()}
                  className="text-[color:var(--text-primary)] border-b border-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] hover:border-[color:var(--accent-raw)] pb-0.5 transition-colors duration-[200ms] ease-editorial"
                >
                  open it manually
                </button>
                .
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

/* ------------------------------------------------------------------ */
/* Local prototype checkout, kept for dev without a Moonbase account.  */
/* ------------------------------------------------------------------ */

const LocalCheckout = () => {
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
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[1080px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">// checkout</Eyebrow>
            </Reveal>
            <h1 className="font-display font-light text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-14 md:mb-16">
              <Reveal
                as="span"
                variant="up"
                className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
                delay={MOTION.page.headline1.delay}
                duration={MOTION.duration.instant}
              >
                checkout
              </Reveal>
            </h1>

            {!isAuthed && (
              <div className="mb-12 border border-[color:var(--border-soft)] p-6 text-[14px] font-sans leading-[1.6]">
                <span className="text-[color:var(--text-secondary)]">
                  you&apos;ll need an account to receive licenses.{" "}
                </span>
                <Link
                  to="/account?next=/checkout"
                  className="group inline-flex items-baseline gap-1.5 text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                >
                  <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-0.5 transition-colors duration-[200ms] ease-editorial">
                    sign in or create one
                  </span>
                  <span className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            )}

            <div className="grid md:grid-cols-[1fr_360px] gap-12 md:gap-20">
              <form onSubmit={submit} className="flex flex-col gap-14">
                <section>
                  <Eyebrow className="mb-7">contact</Eyebrow>
                  <label className="flex flex-col gap-3">
                    <span className={labelClass}>email</span>
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
                  <Eyebrow className="mb-7">payment</Eyebrow>
                  <div className="grid gap-7">
                    <label className="flex flex-col gap-3">
                      <span className={labelClass}>name on card</span>
                      <input
                        type="text"
                        required
                        value={details.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex flex-col gap-3">
                      <span className={labelClass}>card number</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={details.cardNumber}
                        onChange={(e) => update("cardNumber", formatCard(e.target.value))}
                        className={`${fieldClass} placeholder:text-[color:var(--text-tertiary)] font-mono`}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-7">
                      <label className="flex flex-col gap-3">
                        <span className={labelClass}>expiry</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          required
                          placeholder="MM/YY"
                          value={details.expiry}
                          onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                          className={`${fieldClass} placeholder:text-[color:var(--text-tertiary)] font-mono`}
                        />
                      </label>
                      <label className="flex flex-col gap-3">
                        <span className={labelClass}>cvc</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          required
                          placeholder="123"
                          maxLength={4}
                          value={details.cvc}
                          onChange={(e) => update("cvc", e.target.value.replace(/\D+/g, ""))}
                          className={`${fieldClass} placeholder:text-[color:var(--text-tertiary)] font-mono`}
                        />
                      </label>
                    </div>
                  </div>
                </section>

                <section>
                  <Eyebrow className="mb-7">billing address</Eyebrow>
                  <div className="grid grid-cols-2 gap-7">
                    <label className="flex flex-col gap-3 col-span-1">
                      <span className={labelClass}>country</span>
                      <input
                        type="text"
                        required
                        value={details.country}
                        onChange={(e) => update("country", e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex flex-col gap-3 col-span-1">
                      <span className={labelClass}>postal code</span>
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
                  <p className="text-[13px] text-[color:var(--accent-raw)] font-mono">{error}</p>
                )}

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-baseline gap-2 self-start text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial disabled:opacity-50 disabled:cursor-not-allowed tabular-nums"
                  >
                    <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[200ms] ease-editorial">
                      {submitting ? "processing…" : `pay $${total.toFixed(2)}`}
                    </span>
                    {!submitting && (
                      <span className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
                    )}
                  </button>
                  <p className="text-[11px] font-mono text-[color:var(--text-tertiary)]">
                    test cards: 4242 4242 4242 4242 succeeds · ending 0002 declined · 0069 insufficient funds
                  </p>
                </div>
              </form>

              <aside className="md:sticky md:top-32 self-start border-t md:border-t-0 md:border-l border-hairline md:pl-12 pt-10 md:pt-0">
                <Eyebrow className="mb-7">order summary</Eyebrow>
                <ul className="flex flex-col gap-5">
                  {items.map((it) => (
                    <li
                      key={`${it.slug}:${it.license}`}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <div>
                        <div className="font-sans text-[15px] text-[color:var(--text-primary)]">{it.name}</div>
                        <div className="text-[12px] text-[color:var(--text-tertiary)] font-mono mt-0.5">
                          {it.license} · qty {it.quantity}
                        </div>
                      </div>
                      <div className="font-mono text-[14px] tabular-nums text-[color:var(--text-secondary)]">
                        ${(it.price * it.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-hairline pt-5 space-y-3 text-[14px]">
                  <div className="flex justify-between">
                    <span className="font-sans text-[color:var(--text-tertiary)]">subtotal</span>
                    <span className="font-mono tabular-nums text-[color:var(--text-secondary)]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-[color:var(--text-tertiary)]">tax</span>
                    <span className="font-mono tabular-nums text-[color:var(--text-secondary)]">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-hairline items-baseline">
                    <span className="font-sans text-[color:var(--text-primary)]">total</span>
                    <span className="font-mono tabular-nums text-[16px] text-[color:var(--text-primary)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

const Checkout = () => (isMoonbaseEnabled ? <MoonbaseCheckoutMount /> : <LocalCheckout />);

export default Checkout;

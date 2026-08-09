// Checkout — a thin mount point over the Moonbase storefront. We fire
// Moonbase.checkout() on mount, listen for CheckoutCompleted (→ /order/:id) and
// CheckoutClosed (→ /cart). Card collection and processing happen entirely
// inside Moonbase's own iframe; no payment data touches this app.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { useCart } from "@/context/CartContext";
import { Moonbase, MoonbaseEvent } from "@/lib/moonbase";

const Checkout = () => {
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
      // The user dismissed the Moonbase modal without completing. Return them to
      // the cart so they don't sit on an empty checkout shell.
      navigate("/cart", { replace: true });
    });
  }, [items.length, navigate]);

  return (
    <SiteLayout>
      <section data-ink-anchor="Checkout body" className="relative px-[3.2vw] pt-[84px] pb-[130px] min-h-[56vh]">
        <div className="max-w-[720px]">
          <h1
            className="font-editorial italic text-[clamp(42px,5.4vw,72px)] leading-none tracking-[-0.015em] text-[color:var(--ink)] m-0 mb-8"
            style={{ fontWeight: 470 }}
          >
            <Reveal
              as="span"
              variant="up"
              className="inline-block"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              opening checkout
            </Reveal>
          </h1>
          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-mono text-[15px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[52ch] m-0">
              if the checkout window doesn&apos;t appear, your browser may be
              blocking pop-ups.{" "}
              <button
                type="button"
                onClick={() => Moonbase.checkout()}
                className="text-[color:var(--ink)] border-b border-[color:var(--ink)] pb-0.5 transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-raw)] hover:border-[color:var(--accent-raw)]"
              >
                open it manually
              </button>
              .
            </p>
          </Reveal>
          <Reveal variant="up" {...MOTION.page.body1}>
            <p className="font-mono font-semibold text-[11px] uppercase tracking-[0.16em] text-[color:var(--ink-4)] mt-11 mb-0">
              card details are handled by our payment processor. they never touch our servers.
            </p>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Checkout;

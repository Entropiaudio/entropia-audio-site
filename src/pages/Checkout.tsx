// Checkout — a thin mount point over the Moonbase storefront. We fire
// Moonbase.checkout() on mount, listen for CheckoutCompleted (→ /order/:id) and
// CheckoutClosed (→ /cart). Card collection and processing happen entirely
// inside Moonbase's own iframe; no payment data touches this app.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
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

export default Checkout;

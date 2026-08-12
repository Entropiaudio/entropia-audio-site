import { Link, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import InkButton from "@/components/InkButton";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { useCart } from "@/context/CartContext";
import { Moonbase } from "@/lib/moonbase";

const cols = "grid-cols-[2.2fr_1fr_0.6fr_0.9fr_0.9fr]";

const Cart = () => {
  usePageTitle("cart");
  const { items, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <section data-ink-anchor="Cart body" className="relative px-[3.2vw] pt-[84px] pb-[110px] min-h-[52vh]">
        <div className="max-w-[1000px]">
          <h1
            className="font-editorial italic text-[clamp(48px,5.6vw,72px)] leading-none tracking-[-0.015em] text-[color:var(--ink)] m-0 mb-14"
            style={{ fontWeight: 470 }}
          >
            <Reveal
              as="span"
              variant="up"
              className="inline-block"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              cart
            </Reveal>
          </h1>

          {items.length === 0 ? (
            <Reveal
              key="cart-empty"
              variant="up"
              {...MOTION.page.body0}
              className="rule-top-fade py-11"
            >
              <p className="font-mono text-[15.5px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] m-0 mb-6">
                your cart is empty.
              </p>
              <Link to="/#plugins" className="link-ink">
                <span>browse plugins</span>
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ) : (
            <Reveal key="cart-filled" variant="up" {...MOTION.page.body0}>
              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  <div
                    className={`grid ${cols} gap-4 pb-4 font-mono font-semibold text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-3)]`}
                  >
                    <span>plugin</span>
                    <span>license</span>
                    <span>qty</span>
                    <span className="text-right">price</span>
                    <span className="text-right">total</span>
                  </div>

                  {items.map((it) => (
                    <div
                      key={`${it.slug}:${it.license}`}
                      className={`grid ${cols} gap-4 items-baseline rule-top-fade py-5`}
                    >
                      <Link
                        to={`/plugins/${it.slug}`}
                        className="font-mono text-[16px] text-[color:var(--ink)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-ink)]"
                      >
                        {it.name}
                      </Link>
                      <span className="font-mono text-[12px] text-[color:var(--ink-3)]">
                        {it.license}
                      </span>
                      {/* Moonbase owns cart-line mutations inside its drawer;
                          render qty as plain text here. */}
                      <span className="font-mono text-[12px] tabular-nums text-[color:var(--ink-2)]">
                        {it.quantity}
                      </span>
                      <span className="font-mono text-[13px] tabular-nums text-right text-[color:var(--ink-2)]">
                        ${it.price.toFixed(2)}
                      </span>
                      <span className="font-mono text-[14px] tabular-nums text-right text-[color:var(--ink)]">
                        ${(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between gap-8 flex-wrap rule-top-fade pt-8 mt-4">
                <button
                  type="button"
                  onClick={() => Moonbase.view_cart()}
                  className="font-mono font-semibold text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-3)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-ink)]"
                >
                  edit cart →
                </button>

                <div className="text-right">
                  <div className="flex items-baseline gap-5 justify-end">
                    <span className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-3)]">
                      subtotal
                    </span>
                    <span className="font-mono font-semibold text-[26px] tabular-nums text-[color:var(--ink)]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.04em] text-[color:var(--ink-3)] mt-2 mb-5">
                    taxes calculated at checkout.
                  </p>
                  <InkButton
                    size="lg"
                    magnetic
                    trailing="→"
                    onClick={() => navigate("/checkout")}
                  >
                    checkout
                  </InkButton>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Cart;

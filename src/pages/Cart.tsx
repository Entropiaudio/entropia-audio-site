import { Link, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";
import { useCart } from "@/context/CartContext";
import { isMoonbaseEnabled, Moonbase } from "@/lib/moonbase";

const Cart = () => {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[1080px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">// cart</Eyebrow>
            </Reveal>
            <h1 className="font-display font-light text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-16 md:mb-20">
              <Reveal
                as="span"
                variant="up"
                className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
                delay={MOTION.page.headline1.delay}
                duration={MOTION.duration.instant}
              >
                cart
              </Reveal>
            </h1>

            {items.length === 0 ? (
              <Reveal key="cart-empty" variant="up" {...MOTION.page.body0} className="py-12 border-t border-hairline">
                <p className="font-sans text-[17px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] mb-8">
                  your cart is empty.
                </p>
                <MagneticLink
                  to="/"
                  strength={6}
                  className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                >
                  <span className="link-draw pb-1">
                    browse plugins
                  </span>
                  <span aria-hidden="true" className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
                </MagneticLink>
              </Reveal>
            ) : (
              <Reveal key="cart-filled" variant="up" {...MOTION.page.body0}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="text-left text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
                        <th className="pb-5 pr-4 font-medium">plugin</th>
                        <th className="pb-5 pr-4 font-medium">license</th>
                        <th className="pb-5 pr-4 font-medium">qty</th>
                        <th className="pb-5 pr-4 font-medium text-right">price</th>
                        <th className="pb-5 font-medium text-right">total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it) => (
                        <tr key={`${it.slug}:${it.license}`} className="border-t border-hairline">
                          <td className="py-6 pr-4">
                            <Link
                              to={`/plugins/${it.slug}`}
                              className="font-sans text-[16px] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                            >
                              {it.name}
                            </Link>
                          </td>
                          <td className="py-6 pr-4 font-mono text-[13px] text-[color:var(--text-tertiary)]">
                            {it.license}
                          </td>
                          <td className="py-6 pr-4">
                            {isMoonbaseEnabled ? (
                              // Moonbase owns cart-line mutations inside its
                              // drawer; render qty as plain text here.
                              <span className="font-mono text-[13px] tabular-nums text-[color:var(--text-secondary)]">
                                {it.quantity}
                              </span>
                            ) : (
                              <div className="inline-flex items-center border border-[color:var(--border-soft)]">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(it.slug, it.license, it.quantity - 1)}
                                  className="px-3 py-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                                  aria-label="decrease"
                                >
                                  −
                                </button>
                                <span className="px-3 font-mono text-[13px] tabular-nums w-8 text-center">
                                  {it.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQuantity(it.slug, it.license, it.quantity + 1)}
                                  className="px-3 py-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                                  aria-label="increase"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-6 pr-4 text-right font-mono text-[13px] tabular-nums text-[color:var(--text-secondary)]">
                            ${it.price.toFixed(2)}
                          </td>
                          <td className="py-6 text-right">
                            <div className="font-mono text-[14px] tabular-nums text-[color:var(--text-primary)]">
                              ${(it.price * it.quantity).toFixed(2)}
                            </div>
                            {!isMoonbaseEnabled && (
                              <button
                                type="button"
                                onClick={() => remove(it.slug, it.license)}
                                className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                              >
                                remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-t border-hairline pt-10">
                  {isMoonbaseEnabled ? (
                    <button
                      type="button"
                      onClick={() => Moonbase.view_cart()}
                      className="text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial self-start"
                    >
                      edit cart →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={clear}
                      className="text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial self-start"
                    >
                      clear cart
                    </button>
                  )}

                  <div className="md:text-right">
                    <div className="flex md:justify-end items-baseline gap-6">
                      <Eyebrow>subtotal</Eyebrow>
                      <span className="font-mono text-[28px] tabular-nums text-[color:var(--text-primary)]">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[12px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-tertiary)] mt-2">
                      taxes calculated at checkout.
                    </p>
                    <MagneticLink
                      as="button"
                      type="button"
                      strength={6}
                      onClick={() => navigate("/checkout")}
                      className="accent-glow group inline-flex items-baseline gap-2 mt-8 px-6 py-3.5 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)]"
                    >
                      <span>checkout</span>
                      <span aria-hidden="true" className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
                    </MagneticLink>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default Cart;

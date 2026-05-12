import { Link, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[1080px]">
            <Eyebrow accent className="mb-8">// cart</Eyebrow>
            <h1 className="font-display font-light text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-16 md:mb-20">
              <span className="font-editorial italic font-normal tracking-[-0.015em]">
                cart
              </span>
            </h1>

            {items.length === 0 ? (
              <div className="py-12 border-t border-hairline">
                <p className="font-sans text-[17px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] mb-8">
                  your cart is empty.
                </p>
                <Link
                  to="/"
                  className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
                >
                  <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                    browse plugins
                  </span>
                  <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
                </Link>
              </div>
            ) : (
              <>
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
                              className="font-sans text-[16px] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
                            >
                              {it.name}
                            </Link>
                          </td>
                          <td className="py-6 pr-4 font-mono text-[13px] text-[color:var(--text-tertiary)]">
                            {it.license}
                          </td>
                          <td className="py-6 pr-4">
                            <div className="inline-flex items-center border border-[color:var(--border-soft)]">
                              <button
                                type="button"
                                onClick={() => setQuantity(it.slug, it.license, it.quantity - 1)}
                                className="px-3 py-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
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
                                className="px-3 py-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
                                aria-label="increase"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-6 pr-4 text-right font-mono text-[13px] tabular-nums text-[color:var(--text-secondary)]">
                            ${it.price.toFixed(2)}
                          </td>
                          <td className="py-6 text-right">
                            <div className="font-mono text-[14px] tabular-nums text-[color:var(--text-primary)]">
                              ${(it.price * it.quantity).toFixed(2)}
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(it.slug, it.license)}
                              className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
                            >
                              remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-t border-hairline pt-10">
                  <button
                    type="button"
                    onClick={clear}
                    className="text-[12px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial self-start"
                  >
                    clear cart
                  </button>

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
                    <button
                      type="button"
                      onClick={() => navigate("/checkout")}
                      className="group inline-flex items-baseline gap-2 mt-8 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
                    >
                      <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                        checkout
                      </span>
                      <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default Cart;

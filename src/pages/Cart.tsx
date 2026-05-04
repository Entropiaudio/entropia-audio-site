import { Link, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-12">cart</h1>

        {items.length === 0 ? (
          <div className="py-16 border-t border-hairline">
            <p className="text-foreground/60 mb-6">your cart is empty.</p>
            <Link
              to="/"
              className="text-sm underline underline-offset-4 hover:text-accent transition-colors"
            >
              browse plugins →
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-base min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-foreground/50 font-mono">
                    <th className="pb-4 pr-4 font-normal">plugin</th>
                    <th className="pb-4 pr-4 font-normal">license</th>
                    <th className="pb-4 pr-4 font-normal">qty</th>
                    <th className="pb-4 pr-4 font-normal text-right">price</th>
                    <th className="pb-4 font-normal text-right">total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={`${it.slug}:${it.license}`} className="border-t border-hairline">
                      <td className="py-5 pr-4">
                        <Link
                          to={`/plugins/${it.slug}`}
                          className="hover:text-accent transition-colors"
                        >
                          {it.name}
                        </Link>
                      </td>
                      <td className="py-5 pr-4 font-mono text-sm text-foreground/60">
                        {it.license}
                      </td>
                      <td className="py-5 pr-4">
                        <div className="inline-flex items-center border border-hairline">
                          <button
                            type="button"
                            onClick={() => setQuantity(it.slug, it.license, it.quantity - 1)}
                            className="px-3 py-1 hover:text-accent transition-colors"
                            aria-label="decrease"
                          >
                            −
                          </button>
                          <span className="px-3 font-mono text-sm w-8 text-center">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(it.slug, it.license, it.quantity + 1)}
                            className="px-3 py-1 hover:text-accent transition-colors"
                            aria-label="increase"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-5 pr-4 text-right font-mono text-sm">
                        ${it.price.toFixed(2)}
                      </td>
                      <td className="py-5 text-right">
                        <div className="font-mono text-sm">
                          ${(it.price * it.quantity).toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(it.slug, it.license)}
                          className="mt-1 text-xs text-foreground/50 hover:text-accent transition-colors"
                        >
                          remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-hairline pt-8">
              <button
                type="button"
                onClick={clear}
                className="text-sm text-foreground/60 hover:text-accent transition-colors self-start"
              >
                clear cart
              </button>

              <div className="md:text-right">
                <div className="flex md:justify-end items-baseline gap-6">
                  <span className="text-xs uppercase tracking-widest text-foreground/50 font-mono">
                    subtotal
                  </span>
                  <span className="text-2xl font-medium tracking-tight font-mono">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 mt-2">taxes calculated at checkout.</p>
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mt-6 px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-sm"
                >
                  checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
};

export default Cart;

import { Link, Navigate, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { useAuth } from "@/context/AuthContext";

const OrderSuccess = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const order = user?.orders.find((o) => o.id === id);

  if (!order) return <Navigate to="/account" replace />;

  const issued = user!.licenses.filter((l) => l.orderId === order.id);

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <p className="text-xs uppercase tracking-widest text-accent font-mono mb-3">
          payment received
        </p>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
          thanks. your licenses are ready.
        </h1>
        <p className="text-foreground/60 mb-12">
          order <span className="font-mono">{order.id}</span> · charged to card ending{" "}
          <span className="font-mono">{order.paymentLast4}</span>
        </p>

        <section className="mb-12 border-t border-hairline pt-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
            licenses issued
          </h2>
          <table className="w-full text-base">
            <tbody>
              {issued.map((l) => (
                <tr key={l.key} className="border-t border-hairline">
                  <td className="py-4 pr-4">{l.plugin}</td>
                  <td className="py-4 pr-4 font-mono text-sm text-foreground/60">{l.version}</td>
                  <td className="py-4 font-mono text-sm">{l.key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="border-t border-hairline pt-8 mb-12">
          <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">
            order
          </h2>
          <ul className="space-y-3 text-sm">
            {order.items.map((it) => (
              <li key={`${it.slug}:${it.license}`} className="flex justify-between">
                <span>
                  {it.name} <span className="text-foreground/50 font-mono text-xs">× {it.quantity}</span>
                </span>
                <span className="font-mono">${(it.price * it.quantity).toFixed(2)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-hairline pt-3">
              <span>total</span>
              <span className="font-mono">${order.total.toFixed(2)}</span>
            </li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            to="/account"
            className="px-5 py-3 bg-foreground text-background hover:bg-accent transition-colors"
          >
            go to account
          </Link>
          <Link
            to="/"
            className="px-5 py-3 border border-foreground/20 hover:border-foreground transition-colors"
          >
            keep browsing
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
};

export default OrderSuccess;

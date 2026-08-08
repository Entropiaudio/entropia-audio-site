import { Link, Navigate, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { useAuth } from "@/context/AuthContext";
import { copy } from "@/copy";

const OrderSuccess = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const order = user?.orders.find((o) => o.id === id);

  if (!order) return <Navigate to="/account" replace />;

  const issued = user!.licenses.filter((l) => l.orderId === order.id);

  return (
    <SiteLayout>
      <section className="relative px-[3.2vw] pt-[84px] pb-[100px]">
        <div className="max-w-[920px]">
          <Reveal variant="up" {...MOTION.page.eyebrow}>
            <div className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--action-create)] mb-6">
              {copy.orderSuccess.eyebrow}
            </div>
          </Reveal>

          <h1
            className="font-editorial italic text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.015em] text-[color:var(--ink)] m-0"
            style={{ fontWeight: 470 }}
          >
            <Reveal
              as="span"
              variant="up"
              className="inline-block"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              {copy.orderSuccess.headline}
            </Reveal>
          </h1>

          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-mono text-[14px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] mt-6 mb-16">
              order{" "}
              <span className="tabular-nums text-[color:var(--ink)] selectable">{order.id}</span>{" "}
              · charged to card ending{" "}
              <span className="tabular-nums text-[color:var(--ink)]">{order.paymentLast4}</span>
            </p>
          </Reveal>

          <Reveal
            variant="up"
            {...MOTION.section.headline}
            as="section"
            className="border-t border-hairline pt-8 mb-14"
          >
            <div className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-3)] mb-5">
              licenses issued
            </div>
            {issued.map((l) => (
              <div
                key={l.key}
                className="grid grid-cols-[1.4fr_0.7fr_2fr] gap-4 items-baseline border-t border-hairline py-4"
              >
                <span className="font-mono text-[15px] text-[color:var(--ink)]">{l.plugin}</span>
                <span className="font-mono text-[12px] text-[color:var(--ink-3)]">{l.version}</span>
                <span className="font-mono text-[13px] tabular-nums tracking-[0.06em] text-[color:var(--ink-2)] selectable">
                  {l.key}
                </span>
              </div>
            ))}
          </Reveal>

          <Reveal
            variant="up"
            {...MOTION.section.body}
            as="section"
            className="border-t border-hairline pt-8 mb-16 max-w-[560px]"
          >
            <div className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-3)] mb-5">
              order
            </div>
            {order.items.map((it) => (
              <div
                key={`${it.slug}:${it.license}`}
                className="flex justify-between items-baseline py-1.5"
              >
                <span className="font-mono text-[15px] text-[color:var(--ink)]">
                  {it.name}{" "}
                  <span className="text-[11px] text-[color:var(--ink-3)]">× {it.quantity}</span>
                </span>
                <span className="font-mono text-[13px] tabular-nums text-[color:var(--ink-2)]">
                  ${(it.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-baseline border-t border-hairline mt-3.5 pt-4">
              <span className="font-mono text-[15px] text-[color:var(--ink)]">total</span>
              <span className="font-mono text-[16px] tabular-nums text-[color:var(--ink)]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </Reveal>

          <Reveal variant="up" {...MOTION.section.cta}>
            <div className="flex flex-wrap items-baseline gap-9">
              <Link to="/account" className="link-ink">
                <span>go to account</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/"
                className="font-mono font-semibold text-[12px] uppercase tracking-[0.18em] text-[color:var(--ink-3)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--ink)]"
              >
                keep browsing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
};

export default OrderSuccess;

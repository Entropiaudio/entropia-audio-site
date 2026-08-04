import { Link, Navigate, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import MagneticLink from "@/components/motion/MagneticLink";
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
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">
                {copy.orderSuccess.eyebrow}
              </Eyebrow>
            </Reveal>
            <h1 className="text-[44px] md:text-[56px] leading-[1.05] text-[color:var(--ink)]">
              <Reveal
                as="span"
                variant="up"
                className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
                delay={MOTION.page.headline1.delay}
                duration={MOTION.duration.instant}
              >
                {copy.orderSuccess.headline}
              </Reveal>
            </h1>
            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="mt-8 font-sans text-[15px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] mb-16 md:mb-20">
                order <span className="font-mono tabular-nums text-[color:var(--text-primary)]">{order.id}</span> · charged to card ending{" "}
                <span className="font-mono tabular-nums text-[color:var(--text-primary)]">{order.paymentLast4}</span>
              </p>
            </Reveal>

            <Reveal variant="up" {...MOTION.section.headline} as="section" className="mb-16 border-t border-hairline pt-10">
              <Eyebrow className="mb-8">licenses issued</Eyebrow>
              <table className="w-full">
                <tbody>
                  {issued.map((l) => (
                    <tr key={l.key} className="border-t border-hairline">
                      <td className="py-5 pr-6 font-sans text-[15px] text-[color:var(--text-primary)]">
                        {l.plugin}
                      </td>
                      <td className="py-5 pr-6 font-mono text-[13px] text-[color:var(--text-tertiary)]">
                        {l.version}
                      </td>
                      <td className="py-5 font-mono text-[13px] tabular-nums text-[color:var(--text-secondary)]">
                        {l.key}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>

            <Reveal variant="up" {...MOTION.section.body} as="section" className="border-t border-hairline pt-10 mb-16">
              <Eyebrow className="mb-8">order</Eyebrow>
              <ul className="space-y-4 text-[15px]">
                {order.items.map((it) => (
                  <li key={`${it.slug}:${it.license}`} className="flex justify-between items-baseline">
                    <span className="font-sans text-[color:var(--text-primary)]">
                      {it.name}{" "}
                      <span className="text-[color:var(--text-tertiary)] font-mono text-[12px]">
                        × {it.quantity}
                      </span>
                    </span>
                    <span className="font-mono tabular-nums text-[color:var(--text-secondary)]">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-hairline pt-4 items-baseline">
                  <span className="font-sans text-[color:var(--text-primary)]">total</span>
                  <span className="font-mono tabular-nums text-[16px] text-[color:var(--text-primary)]">
                    ${order.total.toFixed(2)}
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal variant="up" {...MOTION.section.cta}>
              <div className="flex flex-wrap items-baseline gap-10">
                <MagneticLink
                  to="/account"
                  strength={6}
                  className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
                >
                  <span className="link-draw pb-1">
                    go to account
                  </span>
                  <span aria-hidden="true" className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
                </MagneticLink>
                <Link
                  to="/"
                  className="link-draw text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[200ms] ease-editorial"
                >
                  keep browsing
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default OrderSuccess;

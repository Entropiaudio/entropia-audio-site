// Landing route for plugin activation links.
//
// The Chaosverb desktop plugin calls Moonbase's `/public/<productId>/activate`
// endpoint and receives a `browser` URL to open. With the "Embedded Widget"
// storefront mode, that URL points at this site. The SDK's internal
// `handleLocationIntent` already handles `?mb_intent=activate_product&mb_token=...`
// on boot; this explicit route additionally handles path-style URLs like
// `/activate?token=...` (some Moonbase deploys, or links forwarded by users).
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { Moonbase } from "@/lib/moonbase";

const Activate = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"working" | "missing">("working");

  useEffect(() => {
    // Accept whichever query param Moonbase decided to send; fall back to
    // common alternates so plugin/server upgrades don't silently break.
    const token =
      params.get("token") ??
      params.get("mb_token") ??
      params.get("activation_token") ??
      params.get("t") ??
      undefined;

    if (!token) {
      // Moonbase modal can still prompt for a token, but flag the missing
      // value so support can spot a broken plugin link in the wild.
      setStatus("missing");
      Moonbase.activate_product();
      return;
    }

    Moonbase.activate_product({ token });
    // Scrub the one-time activation token from the address bar, browser history
    // (incl. synced history), and any same-origin Referer now that it's been
    // handed to the SDK. The SDK only auto-scrubs the canonical
    // ?mb_intent=…&mb_token=… form — not this path-style /activate?token= route —
    // so we do it here to avoid the token lingering where it can be replayed.
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/activate");
    }
  }, [params]);

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[720px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">// activate</Eyebrow>
            </Reveal>
            <h1 className="text-[56px] md:text-[72px] leading-[1.0] text-[color:var(--ink)] mb-10">
              <Reveal
                key={status}
                as="span"
                variant="up"
                className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
                delay={MOTION.page.headline1.delay}
                duration={MOTION.duration.instant}
              >
                opening activation
              </Reveal>
            </h1>
            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="font-sans text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch]">
                {status === "missing"
                  ? "no activation token in this link. sign in and we'll try to match your account."
                  : "if the activation window doesn't appear, your browser may be blocking pop-ups. the plugin can resend the link from the activation screen."}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default Activate;

// Landing route for plugin activation links.
//
// The Chaosverb desktop plugin calls Moonbase's `/public/<productId>/activate`
// endpoint and receives a `browser` URL to open. With the "Embedded Widget"
// storefront mode, that URL points at this site. The SDK's internal
// `handleLocationIntent` already handles `?mb_intent=activate_product&mb_token=...`
// on boot, but this explicit route handles two additional cases:
//   1. Path-style URLs like `/activate?token=...` (some Moonbase deploys, or
//      links forwarded by users)
//   2. When VITE_MOONBASE_URL is not configured, we redirect to the hosted
//      portal so the activation still completes instead of dead-ending.
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import { MOTION } from "@/components/motion/timing";
import { isMoonbaseEnabled, Moonbase } from "@/lib/moonbase";

const HOSTED_FALLBACK = "https://entropiaudio.moonbase.sh/activate";

const Activate = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"working" | "redirecting" | "missing">(
    "working",
  );

  useEffect(() => {
    // Accept whichever query param Moonbase decided to send; fall back to
    // common alternates so plugin/server upgrades don't silently break.
    const token =
      params.get("token") ??
      params.get("mb_token") ??
      params.get("activation_token") ??
      params.get("t") ??
      undefined;

    if (!isMoonbaseEnabled) {
      // Forward to the hosted portal so the user isn't stranded. Preserves
      // the token so they don't have to copy it from the plugin again.
      setStatus("redirecting");
      const target = token ? `${HOSTED_FALLBACK}?token=${encodeURIComponent(token)}` : HOSTED_FALLBACK;
      window.location.replace(target);
      return;
    }

    if (!token) {
      // Moonbase modal can still prompt for a token, but flag the missing
      // value so support can spot a broken plugin link in the wild.
      setStatus("missing");
      Moonbase.activate_product();
      return;
    }

    Moonbase.activate_product({ token });
  }, [params]);

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[720px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">// activate</Eyebrow>
            </Reveal>
            <h1 className="font-display font-light text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-10">
              <RevealWords
                as="span"
                className="font-editorial italic font-normal tracking-[-0.015em]"
                {...MOTION.page.headline1}
                stagger={MOTION.stagger.word}
              >
                {status === "redirecting" ? "redirecting" : "opening activation"}
              </RevealWords>
            </h1>
            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="font-sans text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch]">
                {status === "redirecting"
                  ? "taking you to the moonbase portal to finish activation."
                  : status === "missing"
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

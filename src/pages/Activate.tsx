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
import { usePageTitle } from "@/hooks/usePageTitle";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { Moonbase } from "@/lib/moonbase";

const Activate = () => {
  usePageTitle("activate");
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
      <section data-ink-anchor="Activate body" className="relative px-[3.2vw] pt-[84px] pb-[130px] min-h-[56vh]">
        {/* a single brush mark drifting in from the right margin */}
        <img
          src="/art/mark-drift.png"
          alt=""
          aria-hidden="true"
          className="absolute right-[6%] top-[60px] z-0 w-[clamp(110px,12vw,200px)] mix-blend-multiply opacity-55 pointer-events-none"
        />
        <div className="relative max-w-[720px]">
          <h1
            className="font-editorial italic text-[clamp(42px,5.4vw,72px)] leading-none tracking-[-0.015em] text-[color:var(--ink)] m-0 mb-8"
            style={{ fontWeight: 470 }}
          >
            <Reveal
              key={status}
              as="span"
              variant="up"
              className="inline-block"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              opening activation
            </Reveal>
          </h1>
          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-mono text-[15px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[52ch] m-0">
              {status === "missing"
                ? "no activation token in this link. sign in and we'll try to match your account."
                : "if the activation window doesn't appear, your browser may be blocking pop-ups. the plugin can resend the link from the activation screen."}
            </p>
          </Reveal>
          <Reveal variant="up" {...MOTION.page.body1}>
            <p className="font-mono font-semibold text-[11px] uppercase tracking-[0.16em] text-[color:var(--ink-3)] mt-11 mb-0">
              your activation token is used once and scrubbed from the address bar.
            </p>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Activate;

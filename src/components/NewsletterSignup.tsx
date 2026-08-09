import { FormEvent, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { copy } from "@/copy";
import { subscribeToNewsletter, type NewsletterResult } from "@/lib/newsletter";
import InkButton from "./InkButton";
import LabelledSection from "./primitives/LabelledSection";
import Reveal from "./motion/Reveal";
import { MOTION } from "./motion/timing";

interface NewsletterSignupProps {
  /** Anchor id, so a "get notified" link elsewhere can land on it. */
  id?: string;
  /** Page-specific line under the headline. */
  subline?: string;
}

/**
 * The mailing-list band: tan ground torn in at the brand pitch, the label in
 * the margin, and one field. Posts to whatever `lib/newsletter` is wired to;
 * on success the form is replaced by a single line rather than a toast alone.
 */
const NewsletterSignup = ({ id, subline }: NewsletterSignupProps) => {
  const c = copy.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const result = await subscribeToNewsletter(email);
      if (!result.ok) {
        // tsconfig runs with strict off, so the discriminated union doesn't
        // narrow on `ok` here — read the failure branch explicitly.
        setError((result as Extract<NewsletterResult, { ok: false }>).error);
        return;
      }
      setSubmitted(true);
      setEmail("");
      toast({ title: c.successTitle, description: c.successDescription });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-ink-anchor="Notify"
      className="relative diag-band-top"
      style={{
        background: "var(--tan)",
        paddingTop: "calc(3vw + 56px)",
        paddingBottom: "96px",
      }}
    >
      <LabelledSection id={id} label={c.eyebrow} labelTone="deep" labelPad="10px" className="scroll-mt-8">
        <div className="max-w-[640px]">
          <Reveal variant="up" {...MOTION.section.headline}>
            <h3
              className="font-editorial italic text-[clamp(28px,3vw,44px)] leading-[1.12] text-[color:var(--ink)] mb-3.5"
              style={{ fontWeight: 470 }}
            >
              {c.headlineLine1}
              <br />
              {c.headlineLine2}
            </h3>
          </Reveal>

          <Reveal variant="up" {...MOTION.section.body}>
            <p className="font-mono text-[14px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] mb-6">
              {subline ?? c.subline}
            </p>
          </Reveal>

          <Reveal variant="up" {...MOTION.section.cta}>
            {submitted ? (
              <p className="state-fade font-mono font-semibold text-[13px] uppercase tracking-[0.16em] text-[color:var(--accent-deep)] m-0">
                {c.successInline}
              </p>
            ) : (
              <>
                <form onSubmit={onSubmit} className="flex gap-3 flex-wrap" noValidate>
                  <label className="flex-1 min-w-[220px] block">
                    <span className="sr-only">email</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder={c.placeholder}
                      aria-label="email address"
                      aria-invalid={error ? true : undefined}
                      className="field-ink w-full"
                    />
                  </label>
                  <InkButton size="md" type="submit" disabled={busy}>
                    {busy ? "…" : c.button}
                  </InkButton>
                </form>
                {error && (
                  <p className="mt-4 font-mono font-medium text-[13px] tracking-[0.04em] text-[color:var(--state-error)]">
                    {error}
                  </p>
                )}
              </>
            )}
          </Reveal>
        </div>
      </LabelledSection>
    </div>
  );
};

export default NewsletterSignup;

import { FormEvent, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { copy } from "@/copy";
import { subscribeToNewsletter } from "@/lib/newsletter";
import Section from "./primitives/Section";
import Container from "./primitives/Container";
import Eyebrow from "./primitives/Eyebrow";
import Reveal from "./motion/Reveal";
import MagneticLink from "./motion/MagneticLink";
import { MOTION } from "./motion/timing";

const NewsletterSignup = () => {
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
        setError(result.error);
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
    <Section pad="lg" tone="rule-top">
      <Container width="wide">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-5 md:col-start-2">
            <Eyebrow className="mb-6">{c.eyebrow}</Eyebrow>
            <h3 className="font-display font-light text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">
              <span className="block">{c.headlineLine1}</span>
              <span className="block font-editorial italic font-normal tracking-[-0.015em] text-[color:var(--text-secondary)]">
                {c.headlineLine2}
              </span>
            </h3>
          </Reveal>

          <Reveal variant="up" {...MOTION.section.headline} className="md:col-span-5">
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row gap-6 sm:items-end"
              noValidate
            >
              <label className="flex-1 block">
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
                  className="w-full bg-transparent border-b border-[color:var(--text-tertiary)] focus:border-[color:var(--accent-raw)] outline-none px-0 py-3 text-[16px] font-editorial placeholder:text-[color:var(--text-tertiary)] transition-colors duration-[400ms] ease-editorial"
                />
              </label>
              <MagneticLink
                as="button"
                type="submit"
                strength={5}
                disabled={busy}
                className="group inline-flex items-baseline gap-2 self-start sm:self-auto text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial pb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="link-draw pb-1">
                  {busy ? "…" : c.button}
                </span>
                <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
              </MagneticLink>
            </form>
            {error && (
              <p className="mt-4 text-[12px] font-mono text-[color:var(--accent-raw)]">
                {error}
              </p>
            )}
          </Reveal>
        </div>

        {submitted && (
          <p className="md:pl-[8.333%] mt-10 text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
            {c.afterSubmit}
          </p>
        )}
      </Container>
    </Section>
  );
};

export default NewsletterSignup;

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
    <Section pad="lg">
      <Container width="wide">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-5 md:col-start-2">
            <Eyebrow className="mb-6">{c.eyebrow}</Eyebrow>
            <h3 className="text-[color:var(--ink)]">
              <span className="block font-display text-[38px] md:text-[50px] leading-[0.95]">
                {c.headlineLine1}
              </span>
              <span className="block font-editorial italic text-[24px] md:text-[30px] leading-[1.25] mt-2 text-[color:var(--ink-2)]">
                {c.headlineLine2}
              </span>
            </h3>
          </Reveal>

          <Reveal variant="up" {...MOTION.section.headline} className="md:col-span-5">
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row gap-4 sm:items-center"
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
                  className="w-full rounded-sm bg-[color:var(--field)] border border-[color:var(--ink-line)] focus:border-[color:var(--accent-raw)] outline-none px-4 py-3 text-[15px] font-sans text-[color:var(--ink)] placeholder:text-[color:var(--ink-3)] shadow-[inset_0_1px_3px_rgba(38,16,25,0.08)] transition-colors duration-[200ms] ease-editorial"
                />
              </label>
              <MagneticLink
                as="button"
                type="submit"
                strength={5}
                disabled={busy}
                className="btn btn-solid self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{busy ? "…" : c.button}</span>
                <span aria-hidden="true" className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
              </MagneticLink>
            </form>
            {error && (
              <p className="mt-4 text-[13px] font-mono font-medium tracking-[0.04em] text-[color:var(--state-error)]">
                {error}
              </p>
            )}
          </Reveal>
        </div>

        {submitted && (
          <p className="md:pl-[8.333%] mt-10 text-[11px] font-mono font-medium uppercase tracking-eyebrow text-[color:var(--ink-3)]">
            {c.afterSubmit}
          </p>
        )}
      </Container>
    </Section>
  );
};

export default NewsletterSignup;

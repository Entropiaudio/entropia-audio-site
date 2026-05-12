import { FormEvent, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { copy } from "@/copy";
import Section from "./primitives/Section";
import Container from "./primitives/Container";
import Eyebrow from "./primitives/Eyebrow";

const NewsletterSignup = () => {
  const c = copy.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast({ title: c.successTitle, description: c.successDescription });
    setEmail("");
  };

  return (
    <Section pad="lg" tone="rule-top">
      <Container width="wide">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-5 md:col-start-2">
            <Eyebrow className="mb-6">{c.eyebrow}</Eyebrow>
            <h3 className="font-display font-light text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">
              <span className="block">{c.headlineLine1}</span>
              <span className="block font-editorial italic font-normal tracking-[-0.015em] text-[color:var(--text-secondary)]">
                {c.headlineLine2}
              </span>
            </h3>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-5 flex flex-col sm:flex-row gap-6 sm:items-end"
          >
            <label className="flex-1 block">
              <span className="sr-only">email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.placeholder}
                aria-label="email address"
                className="w-full bg-transparent border-b border-[color:var(--text-tertiary)] focus:border-[color:var(--accent-raw)] outline-none px-0 py-3 text-[16px] font-editorial placeholder:text-[color:var(--text-tertiary)] transition-colors duration-[400ms] ease-editorial"
              />
            </label>
            <button
              type="submit"
              className="group inline-flex items-baseline gap-2 self-start sm:self-auto text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial pb-3"
            >
              <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                {c.button}
              </span>
              <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
            </button>
          </form>
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

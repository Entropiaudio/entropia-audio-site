import { FormEvent, useState } from "react";
import { toast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast({
      title: "subscribed.",
      description: "we'll be in touch — sparingly, when there's something worth saying.",
    });
    setEmail("");
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-40 border-t border-hairline">
      <div className="grid md:grid-cols-[1fr,1.2fr] gap-10 md:gap-20 items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-4">
            mailing list
          </div>
          <h3 className="text-3xl md:text-4xl font-display tracking-tight-display leading-tight">
            we ship rarely.
            <br />
            <span className="text-foreground/55">when there's something worth saying, we'll send a short note.</span>
          </h3>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            aria-label="email address"
            className="flex-1 bg-transparent border-b border-foreground/30 focus:border-foreground outline-none px-1 py-3 text-base placeholder:text-foreground/40 transition-colors"
          />
          <button
            type="submit"
            className="text-sm self-start sm:self-auto px-6 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            subscribe
          </button>
        </form>
      </div>
      {submitted && (
        <p className="text-xs text-foreground/45 mt-6 font-mono uppercase tracking-widest">
          // thanks.
        </p>
      )}
    </section>
  );
};

export default NewsletterSignup;

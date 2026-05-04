import { FormEvent, useState } from "react";
import { toast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast({ title: "subscribed.", description: "we'll be in touch — sparingly." });
    setEmail("");
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-hairline">
      <p className="text-sm text-foreground/60 mb-6">stay in the loop</p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-xl"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          className="flex-1 bg-transparent border-b border-hairline focus:border-foreground outline-none px-1 py-3 text-base placeholder:text-foreground/40 transition-colors"
        />
        <button
          type="submit"
          className="text-sm self-start sm:self-auto px-5 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          subscribe
        </button>
      </form>
      {submitted && (
        <p className="text-xs text-foreground/50 mt-4 font-mono">// thanks.</p>
      )}
    </section>
  );
};

export default NewsletterSignup;

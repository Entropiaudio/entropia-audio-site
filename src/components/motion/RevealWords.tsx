import { ReactNode } from "react";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

interface RevealWordsProps {
  /** Text to split into words. */
  children: string;
  /** Wrapper class applied to the block. */
  className?: string;
  /** Per-word delay in ms (cumulative). */
  stagger?: number;
  /** Base delay before the first word fires. */
  delay?: number;
  /** Duration of each word's reveal. */
  duration?: number;
  /** Optional wrap element. Defaults to span. */
  as?: "span" | "div";
  /** Optional className applied to each word span. */
  wordClassName?: string;
  /** Optional ReactNode to render in place of the empty whitespace between words. */
  spaceNode?: ReactNode;
}

/**
 * Splits a string into words and reveals each one with a staggered fade-up.
 * Used to match the home hero's headline cascade across other pages.
 */
const RevealWords = ({
  children,
  className,
  stagger = 45,
  delay = 0,
  duration = 420,
  as = "span",
  wordClassName,
}: RevealWordsProps) => {
  const Wrap = as;
  const parts = children.split(/(\s+)/);
  let wordIndex = -1;

  return (
    <Wrap className={cn(className)}>
      {parts.map((p, i) => {
        if (p.trim().length === 0) {
          return <span key={i}>{p}</span>;
        }
        wordIndex++;
        return (
          <Reveal
            key={i}
            as="span"
            variant="up"
            delay={delay + wordIndex * stagger}
            duration={duration}
            className={cn("inline-block", wordClassName)}
          >
            {p}
          </Reveal>
        );
      })}
    </Wrap>
  );
};

export default RevealWords;

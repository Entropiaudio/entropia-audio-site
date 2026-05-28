import { useScrollProgressRef } from "@/hooks/useScrollMotion";

/**
 * Thin copper progress bar pinned to the very top of the viewport.
 * Sits above the sticky header. Driven entirely by ref-based DOM
 * mutation, no React re-render during scroll.
 */
const ScrollProgress = () => {
  const ref = useScrollProgressRef<HTMLDivElement>();
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[1px] pointer-events-none"
    >
      <div
        ref={ref}
        className="h-full origin-left bg-[color:var(--accent-raw)]"
        style={{
          transform: "scaleX(0)",
          transition: "transform 80ms linear",
          opacity: 0,
        }}
      />
    </div>
  );
};

export default ScrollProgress;

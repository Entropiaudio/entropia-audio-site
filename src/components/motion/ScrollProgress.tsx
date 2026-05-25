import { useScrollProgress } from "@/hooks/useScrollMotion";

/**
 * Thin copper progress bar pinned to the very top of the viewport.
 * Sits above the sticky header.
 */
const ScrollProgress = () => {
  const p = useScrollProgress();
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[1px] pointer-events-none"
    >
      <div
        className="h-full origin-left bg-[color:var(--accent-raw)]"
        style={{
          transform: `scaleX(${p})`,
          transition: "transform 80ms linear",
          opacity: p > 0.001 ? 1 : 0,
        }}
      />
    </div>
  );
};

export default ScrollProgress;

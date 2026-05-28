import { useEffect, useRef, useState } from "react";

/**
 * Editorial scroll-motion primitives, IntersectionObserver + rAF based.
 * No external libs. Honors prefers-reduced-motion.
 *
 * Scroll-driven hooks are deliberately ref-based and write to DOM directly
 * (no setState during scroll) so React reconciliation stays out of the
 * 60fps scroll critical path. Calling setState on every scroll frame is
 * the most common source of jank on otherwise simple pages.
 */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fires once when the element enters the viewport. Adds `data-revealed="true"`. */
export function useReveal<T extends HTMLElement = HTMLElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.setAttribute("data-revealed", "true");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-revealed", "true");
            if (opts?.once !== false) io.unobserve(el);
          } else if (opts?.once === false) {
            el.setAttribute("data-revealed", "false");
          }
        }
      },
      {
        threshold: opts?.threshold ?? 0.15,
        rootMargin: opts?.rootMargin ?? "0px 0px -10% 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [opts?.threshold, opts?.rootMargin, opts?.once]);

  return ref;
}

/**
 * Returns a ref to attach to a bar element. The hook directly mutates the
 * element's `style.transform = scaleX(p)` on each scroll frame, so no
 * React re-renders happen during scroll.
 */
export function useScrollProgressRef<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let queued = false;
    let lastP = -1;

    const compute = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      const clamped = next < 0 ? 0 : next > 1 ? 1 : next;
      // Only write to the DOM if progress moved enough to matter.
      if (Math.abs(clamped - lastP) > 0.0005) {
        lastP = clamped;
        el.style.transform = `scaleX(${clamped})`;
        el.style.opacity = clamped > 0.001 ? "1" : "0";
      }
      queued = false;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}

/**
 * Magnetic hover: pulls the element toward the cursor while hovering.
 * Strength is in pixels of max displacement.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 14) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let targetX = 0;
    let targetY = 0;
    let active = false;

    const tick = () => {
      tx += (targetX - tx) * 0.18;
      ty += (targetY - ty) * 0.18;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      if (active || Math.abs(tx) > 0.1 || Math.abs(ty) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        el.style.transform = "";
      }
    };

    const onEnter = () => {
      active = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      targetX = dx * strength;
      targetY = dy * strength;
    };
    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    };
  }, [strength]);

  return ref;
}

/**
 * Scrubbing reveal driver. Accepts a callback that receives 0..1 progress on
 * each rAF tick during scroll. The consumer is responsible for any DOM
 * mutations, e.g. setting per-word opacity. Zero React state changes.
 * Returns a ref to attach to the scrubbed element (used to measure position).
 */
export function useScrollScrub<T extends HTMLElement = HTMLElement>(
  onUpdate: (progress: number) => void,
) {
  const ref = useRef<T | null>(null);
  // Keep the latest callback in a ref so we don't have to re-bind scroll
  // listeners every render.
  const cbRef = useRef(onUpdate);
  cbRef.current = onUpdate;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      cbRef.current(1);
      return;
    }

    let raf = 0;
    let queued = false;

    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const span = start - end;
      const traveled = start - r.top;
      const p = Math.max(0, Math.min(1, traveled / span));
      cbRef.current(p);
      queued = false;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}

/**
 * Parallax: directly mutates `transform: translate3d(0, Ypx, 0)` on the
 * referenced element as it moves through the viewport. No React state, no
 * re-renders during scroll. Returns a ref to attach to the moving element.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(amount = 60) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let queued = false;
    let last = 0;

    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      const ratio = (vh / 2 - center) / vh;
      const next = ratio * amount;
      // Subpixel debounce: avoid noisy DOM writes when nothing changed.
      if (Math.abs(next - last) > 0.25) {
        last = next;
        el.style.transform = `translate3d(0, ${next.toFixed(2)}px, 0)`;
      }
      queued = false;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.style.transform = "";
    };
  }, [amount]);

  return ref;
}

/** Tracks pointer position relative to a target element. Normalized -1..1. */
export function usePointerOffset<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setPos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    const onLeave = () => setPos({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return { ref, pos };
}

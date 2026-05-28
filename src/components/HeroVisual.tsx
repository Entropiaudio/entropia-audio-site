import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HeroVisualProps {
  className?: string;
  /** Particles per 100k pixels. Default 0.18, quiet density. */
  density?: number;
  /** 0..1 opacity ceiling for the particle alpha. */
  intensity?: number;
}

/**
 * Slow-breathing flow-field particle drift on canvas. Non-interactive, the
 * field drifts under its own flow noise only. Honors prefers-reduced-motion
 * by rendering a single static frame with no rAF loop.
 */
export const HeroVisual = ({
  className,
  density = 0.22,
  intensity = 0.26,
}: HeroVisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; phase: number }> = [];
    let rafId: number | null = null;
    let t = 0;

    const seedParticles = () => {
      const count = Math.max(80, Math.floor((width * height) / 10000 * density));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        life: Math.random() * 600,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#14110F";
      ctx.fillRect(0, 0, width, height);
      seedParticles();
    };

    const step = () => {
      ctx.fillStyle = "rgba(20, 17, 15, 0.16)";
      ctx.fillRect(0, 0, width, height);

      t += 0.00022;

      for (const p of particles) {
        const ax = Math.sin(p.x * 0.0035 + t * 1.0) + Math.cos(p.y * 0.0028 - t * 0.7);
        const ay = Math.cos(p.x * 0.0030 - t * 0.9) + Math.sin(p.y * 0.0036 + t * 0.6);
        const angle = (ax + ay) * 0.9;

        const fx = Math.cos(angle) * 0.006;
        const fy = Math.sin(angle) * 0.006;

        p.vx = (p.vx + fx) * 0.95;
        p.vy = (p.vy + fy) * 0.95;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -8) p.x = width + 8;
        else if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8;
        else if (p.y > height + 8) p.y = -8;

        p.life++;
        const pulse = 0.5 + 0.5 * Math.sin(p.life * 0.001 + p.phase);
        const alpha = intensity * (0.25 + 0.75 * pulse);

        ctx.fillStyle = `rgba(212, 165, 116, ${alpha.toFixed(3)})`;
        ctx.fillRect(p.x - 1, p.y - 1, 2.5, 2.5);
      }

      rafId = requestAnimationFrame(step);
    };

    const renderStaticFrame = () => {
      ctx.fillStyle = "#14110F";
      ctx.fillRect(0, 0, width, height);
      for (const p of particles) {
        ctx.fillStyle = `rgba(212, 165, 116, ${intensity * 0.6})`;
        ctx.fillRect(p.x, p.y, 1, 1);
      }
    };

    resize();
    if (reducedMotion) {
      renderStaticFrame();
    } else {
      for (let i = 0; i < 40; i++) step();
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(step);
    }

    // Coalesce resize bursts (window drag, devtools toggle) into one rAF.
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        resize();
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
    };
  }, [density, intensity]);

  return (
    <div ref={wrapRef} className={cn("relative w-full h-full", className)} aria-hidden="true">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 45%, rgba(212, 165, 116, 0.08), transparent 70%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 65% at 55% 50%, #000 35%, rgba(0,0,0,0.55) 65%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 65% at 55% 50%, #000 35%, rgba(0,0,0,0.55) 65%, transparent 92%)",
        }}
      />
      {/* second very-soft radial that breathes with the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 40% at 20% 100%, rgba(212, 165, 116, 0.05), transparent 70%)",
        }}
      />
    </div>
  );
};

export default HeroVisual;

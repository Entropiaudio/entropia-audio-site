import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FilmPlateProps {
  /** MP4 source (muted, short, self-contained). */
  src: string;
  /** Poster frame shown before playback and under reduced motion. */
  poster: string;
  /** Accessible name for the play control. */
  label: string;
  /** CSS aspect ratio of the film, e.g. "9/16". */
  aspect?: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A short silent film mounted like a printed plate: hairline frame, warm ink
 * shadow, poster until it earns attention. Plays once when it enters the
 * viewport, holds its final frame, and offers a small caps "replay" chip.
 * Under prefers-reduced-motion nothing auto-plays — the chip becomes the way
 * in. Scrolling away mid-film pauses it; coming back resumes.
 */
const FilmPlate = ({ src, poster, label, aspect = "9/16", className }: FilmPlateProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = prefersReducedMotion();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (reduced) return; // the chip is the only way in
            if (!startedRef.current) {
              startedRef.current = true;
              void video.play().catch(() => {});
            } else if (video.paused && !video.ended) {
              void video.play().catch(() => {});
            }
          } else if (!video.paused && !video.ended) {
            video.pause();
          }
        }
      },
      { threshold: 0.45 },
    );

    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    startedRef.current = true;
    if (video.ended) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg border border-hairline cursor-pointer",
        className,
      )}
      style={{ aspectRatio: aspect, boxShadow: "var(--shadow-lift)" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-2.5 right-2.5 inline-flex items-center h-[22px] px-3 rounded-[11px]",
          "font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink)]",
          "border border-hairline transition-opacity duration-[200ms] ease-editorial",
          playing ? "opacity-0" : "opacity-100",
        )}
        style={{ background: "rgba(250, 236, 214, 0.88)" }}
      >
        {ended ? "replay" : "play"}
      </span>
    </div>
  );
};

export default FilmPlate;

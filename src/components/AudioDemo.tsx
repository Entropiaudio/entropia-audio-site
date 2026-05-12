import { useEffect, useRef, useState } from "react";
import type { PluginDemo } from "@/data/plugins";

type Props = {
  demo: PluginDemo;
  index: number;
};

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const AudioDemo = ({ demo, index }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState<"wet" | "dry">("wet");

  const hasDry = !!demo.drySrc;
  const activeSrc = mode === "dry" ? demo.drySrc ?? demo.src : demo.src;
  const fileMissing = !activeSrc;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setCurrent(a.currentTime);
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [activeSrc]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || fileMissing) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration || fileMissing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    a.currentTime = Math.max(0, Math.min(duration, ratio * duration));
  };

  const onScrubKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration || fileMissing) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      a.currentTime = Math.min(duration, a.currentTime + 2);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      a.currentTime = Math.max(0, a.currentTime - 2);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Home") {
      e.preventDefault();
      a.currentTime = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      a.currentTime = duration;
    }
  };

  return (
    <article className="grid md:grid-cols-[auto,1fr] gap-6 md:gap-10 py-10 md:py-14 border-t border-hairline first:border-t-0">
      <div className="text-[11px] font-mono tabular-nums tracking-[0.18em] uppercase text-[color:var(--text-tertiary)] md:pt-2">
        {String(index + 1).padStart(2, "0")} / demo
      </div>

      <div>
        <h4 className="font-editorial italic text-[22px] md:text-[26px] leading-[1.25] text-[color:var(--text-primary)] mb-3">
          {demo.title}
        </h4>
        <p className="font-sans font-normal text-[15px] md:text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[48ch] mb-8">
          {demo.caption}
        </p>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={toggle}
            disabled={fileMissing}
            aria-label={playing ? "pause" : "play"}
            className="w-11 h-11 rounded-full border border-[color:var(--text-tertiary)] hover:border-[color:var(--accent-raw)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <rect x="2" y="1" width="3" height="10" />
                <rect x="7" y="1" width="3" height="10" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M2 1 L11 6 L2 11 Z" />
              </svg>
            )}
          </button>

          <div
            role="slider"
            aria-label={`scrub ${demo.title}`}
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={fileMissing ? -1 : 0}
            onClick={scrub}
            onKeyDown={onScrubKey}
            className={`flex-1 h-2 flex items-center relative ${fileMissing ? "" : "cursor-pointer"}`}
          >
            <div className="absolute inset-x-0 h-px bg-[color:var(--text-tertiary)]" />
            <div
              className="absolute h-px top-1/2 -translate-y-1/2 left-0 bg-[color:var(--accent-raw)]"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-[color:var(--accent-raw)] rounded-full"
              style={{ left: `${progress * 100}%`, opacity: fileMissing ? 0 : 1 }}
            />
          </div>

          <span className="text-[12px] font-mono tabular-nums text-[color:var(--text-tertiary)] w-20 text-right">
            {fileMissing ? "0:00 / 0:00" : `${formatTime(current)} / ${formatTime(duration)}`}
          </span>
        </div>

        {hasDry && (
          <div className="mt-5 flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.18em]">
            <span className="text-[color:var(--text-tertiary)]">a/b</span>
            <button
              type="button"
              onClick={() => setMode("dry")}
              className={`pb-1 transition-colors duration-[400ms] ease-editorial ${
                mode === "dry"
                  ? "text-[color:var(--text-primary)] border-b border-[color:var(--text-primary)]"
                  : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]"
              }`}
            >
              dry
            </button>
            <button
              type="button"
              onClick={() => setMode("wet")}
              className={`pb-1 transition-colors duration-[400ms] ease-editorial ${
                mode === "wet"
                  ? "text-[color:var(--text-primary)] border-b border-[color:var(--text-primary)]"
                  : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]"
              }`}
            >
              wet
            </button>
          </div>
        )}

        {fileMissing && (
          <p className="mt-5 text-[11px] font-mono text-[color:var(--text-tertiary)] uppercase tracking-[0.18em]">
            // audio coming soon
          </p>
        )}

        <audio ref={audioRef} src={activeSrc || undefined} preload="none" />
      </div>
    </article>
  );
};

export default AudioDemo;

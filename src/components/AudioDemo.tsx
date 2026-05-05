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
      <div className="font-mono text-xs text-foreground/50 tracking-widest uppercase md:pt-2">
        {String(index + 1).padStart(2, "0")} / demo
      </div>

      <div>
        <h4 className="text-xl md:text-2xl font-display tracking-tight-display mb-2">
          {demo.title}
        </h4>
        <p className="text-base text-foreground/65 leading-relaxed measure mb-6">
          {demo.caption}
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            disabled={fileMissing}
            aria-label={playing ? "pause" : "play"}
            className="w-11 h-11 rounded-full border border-foreground/30 hover:border-foreground hover:text-accent transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
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
            <div className="absolute inset-x-0 h-px bg-foreground/20" />
            <div
              className="absolute h-px top-1/2 -translate-y-1/2 left-0 bg-foreground"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rounded-full"
              style={{ left: `${progress * 100}%`, opacity: fileMissing ? 0 : 1 }}
            />
          </div>

          <span className="font-mono text-xs text-foreground/50 tabular-nums w-20 text-right">
            {fileMissing ? "0:00 / 0:00" : `${formatTime(current)} / ${formatTime(duration)}`}
          </span>
        </div>

        {hasDry && (
          <div className="mt-4 flex items-center gap-3 text-xs font-mono uppercase tracking-widest">
            <span className="text-foreground/55">a/b</span>
            <button
              type="button"
              onClick={() => setMode("dry")}
              className={`px-2 py-1 transition-colors ${
                mode === "dry"
                  ? "text-foreground border-b border-foreground"
                  : "text-foreground/55 hover:text-foreground"
              }`}
            >
              dry
            </button>
            <button
              type="button"
              onClick={() => setMode("wet")}
              className={`px-2 py-1 transition-colors ${
                mode === "wet"
                  ? "text-foreground border-b border-foreground"
                  : "text-foreground/55 hover:text-foreground"
              }`}
            >
              wet
            </button>
          </div>
        )}

        {fileMissing && (
          <p className="mt-4 text-xs font-mono text-foreground/55 uppercase tracking-widest">
            // audio coming soon
          </p>
        )}

        <audio ref={audioRef} src={activeSrc || undefined} preload="none" />
      </div>
    </article>
  );
};

export default AudioDemo;

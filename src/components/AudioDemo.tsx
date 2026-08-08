import { useCallback, useEffect, useRef, useState } from "react";
import type { PluginDemo } from "@/data/plugins";
import {
  claimPlayback,
  getAudioContext,
  loadAudioBuffer,
  releasePlayback,
  unlockAudio,
} from "@/lib/audioPlayback";

type Props = {
  demo: PluginDemo;
  index: number;
};

type Mode = "dry" | "dryWet" | "wet";

const MODE_ORDER: ReadonlyArray<Mode> = ["dry", "dryWet", "wet"];
const MODE_LABELS: Record<Mode, string> = {
  dry: "dry",
  dryWet: "dry + wet",
  wet: "wet",
};

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const stemUrl = (demo: PluginDemo, mode: Mode): string | undefined => {
  if (mode === "dry") return demo.drySrc;
  if (mode === "wet") return demo.wetSrc;
  return demo.dryWetSrc;
};

const FADE_SECONDS = 0.025;

const AudioDemo = ({ demo, index }: Props) => {
  const [mode, setMode] = useState<Mode>("dryWet");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);

  // Live Web Audio nodes. Recreated on every (re)start and on every seek.
  const sourcesRef = useRef<Partial<Record<Mode, AudioBufferSourceNode>>>({});
  const gainsRef = useRef<Partial<Record<Mode, GainNode>>>({});
  // Decoded buffers, cached for synchronous seek (avoids waiting for
  // `loadAudioBuffer`'s promise on every scrub commit).
  const buffersRef = useRef<Partial<Record<Mode, AudioBuffer>>>({});
  const startTimeRef = useRef(0);
  const durationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastSecondRef = useRef(-1);
  // True while the user is dragging the knob, so the rAF tick stops fighting
  // the drag preview for control of the bar.
  const draggingRef = useRef(false);
  // If the user scrubs before pressing play, this is the offset start()
  // will pick up.
  const pendingOffsetRef = useRef(0);
  // Latest mode in a ref so the seek path can read it without re-binding.
  const modeRef = useRef<Mode>(mode);
  modeRef.current = mode;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const progressKnobRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const availableModes = MODE_ORDER.filter((m) => !!stemUrl(demo, m));
  const anyStem = availableModes.length > 0;

  const setVisualPosition = (offset: number) => {
    const dur = durationRef.current;
    if (dur <= 0) return;
    const pct = Math.max(0, Math.min(100, (offset / dur) * 100));
    if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
    if (progressKnobRef.current) progressKnobRef.current.style.left = `${pct}%`;
  };

  const stop = useCallback(() => {
    const sources = sourcesRef.current;
    const gains = gainsRef.current;
    for (const m of MODE_ORDER) {
      try {
        sources[m]?.stop();
      } catch {
        /* already stopped */
      }
      try {
        sources[m]?.disconnect();
      } catch {
        /* noop */
      }
      try {
        gains[m]?.disconnect();
      } catch {
        /* noop */
      }
    }
    sourcesRef.current = {};
    gainsRef.current = {};
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setVisualPosition(0);
    lastSecondRef.current = -1;
    pendingOffsetRef.current = 0;
    setPlaying(false);
    setCurrentSec(0);
  }, []);

  // Stop + release the playback registry slot on unmount.
  useEffect(() => {
    return () => {
      stop();
      releasePlayback(stop);
    };
  }, [stop]);

  // Mode-switch crossfade — only when actively playing. Out of band the new
  // mode is just remembered for the next start.
  useEffect(() => {
    if (!playing) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    for (const m of MODE_ORDER) {
      const g = gainsRef.current[m];
      if (!g) continue;
      const target = m === mode ? 1 : 0;
      const startVal = g.gain.value;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(startVal, now);
      g.gain.linearRampToValueAtTime(target, now + FADE_SECONDS);
    }
  }, [mode, playing]);

  /** Build + start the per-stem source/gain nodes at the supplied offset.
   *  Assumes buffers are already in `buffersRef`. Caller handles cleanup of
   *  any previous nodes. */
  const spinUp = (offset: number, leadIn = 0.04) => {
    const ctx = getAudioContext();
    const startAt = ctx.currentTime + leadIn;
    const newSources: Partial<Record<Mode, AudioBufferSourceNode>> = {};
    const newGains: Partial<Record<Mode, GainNode>> = {};

    for (const m of MODE_ORDER) {
      const buffer = buffersRef.current[m];
      if (!buffer) continue;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = m === modeRef.current ? 1 : 0;

      source.connect(gain).connect(ctx.destination);
      // start(when, offset) — schedules looped playback to begin at `startAt`
      // with the source already advanced to `offset` seconds into its buffer.
      source.start(startAt, offset);

      newSources[m] = source;
      newGains[m] = gain;
    }

    sourcesRef.current = newSources;
    gainsRef.current = newGains;
    // Pivot the "virtual start" so `ctx.currentTime - startTimeRef = elapsed`
    // even though we started mid-buffer.
    startTimeRef.current = startAt - offset;
  };

  /** Seek to `offset` seconds (clamped). Works while playing (recreates
   *  sources) or paused (stages the offset for the next start). */
  const seekToOffset = useCallback((rawOffset: number) => {
    const dur = durationRef.current;
    if (dur <= 0 || !anyStem) return;
    const offset = Math.max(0, Math.min(dur - 0.01, rawOffset));

    setVisualPosition(offset);
    setCurrentSec(offset);
    lastSecondRef.current = Math.floor(offset);

    if (!playingRef.current) {
      pendingOffsetRef.current = offset;
      return;
    }

    // Tear down current nodes immediately, then build fresh ones at the new
    // offset. With buffers cached this is synchronous + cheap.
    const sources = sourcesRef.current;
    const gains = gainsRef.current;
    for (const m of MODE_ORDER) {
      try {
        sources[m]?.stop();
      } catch {
        /* noop */
      }
      try {
        sources[m]?.disconnect();
      } catch {
        /* noop */
      }
      try {
        gains[m]?.disconnect();
      } catch {
        /* noop */
      }
    }
    spinUp(offset, 0.01);
  }, [anyStem]);

  const tickProgress = useCallback(() => {
    const ctx = getAudioContext();
    const dur = durationRef.current;
    if (dur > 0 && !draggingRef.current) {
      const elapsed = ctx.currentTime - startTimeRef.current;
      const loopPos = ((elapsed % dur) + dur) % dur;
      setVisualPosition(loopPos);
      const sec = Math.floor(loopPos);
      if (sec !== lastSecondRef.current) {
        lastSecondRef.current = sec;
        setCurrentSec(loopPos);
      }
    }
    rafRef.current = requestAnimationFrame(tickProgress);
  }, []);

  const start = useCallback(async () => {
    if (!anyStem) return;
    // iOS Safari: prime the audio session synchronously inside the user
    // gesture (silent buffer + resume()), then await the resume promise.
    // Without this the long fetch/decode lets iOS suspend the context and
    // playback never becomes audible.
    const unlockPromise = unlockAudio();
    setLoading(true);
    try {
      const ctx = getAudioContext();
      await unlockPromise;
      if (ctx.state === "suspended") await ctx.resume();

      // Fetch + decode every available stem in parallel (cached, so only the
      // first play pays the cost).
      const loaded = await Promise.all(
        availableModes.map((m) =>
          loadAudioBuffer(stemUrl(demo, m)!).then(
            (buf) => [m, buf] as const,
          ),
        ),
      );

      const newBuffers: Partial<Record<Mode, AudioBuffer>> = {};
      let maxDuration = 0;
      for (const [m, buffer] of loaded) {
        newBuffers[m] = buffer;
        maxDuration = Math.max(maxDuration, buffer.duration);
      }
      buffersRef.current = newBuffers;
      durationRef.current = maxDuration;
      setDuration(maxDuration);

      // Claim mutual exclusion AFTER decoding succeeds, so a slow-loading
      // demo doesn't preemptively kill a demo that's already playing.
      claimPlayback(stop);

      const offset = pendingOffsetRef.current;
      pendingOffsetRef.current = 0;
      spinUp(offset, 0.06);
      setPlaying(true);

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tickProgress);
      }
    } catch (err) {
      console.error("audio demo failed to start", err);
      stop();
    } finally {
      setLoading(false);
    }
  }, [anyStem, availableModes, demo, stop, tickProgress]);

  const onToggle = () => {
    if (playing) {
      stop();
      releasePlayback(stop);
    } else {
      void start();
    }
  };

  // --------------------------------------------------------------------
  // Scrub / drag handling on the progress bar.
  // --------------------------------------------------------------------
  const offsetFromPointer = (clientX: number): number => {
    const el = progressBarRef.current;
    if (!el || durationRef.current <= 0) return 0;
    const r = el.getBoundingClientRect();
    const ratio = (clientX - r.left) / r.width;
    return Math.max(0, Math.min(1, ratio)) * durationRef.current;
  };

  const onBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!anyStem || durationRef.current <= 0) return;
    // Ignore the keyboard-driven synthetic clicks (no real pointer).
    if (e.button !== undefined && e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    draggingRef.current = true;

    const previewAt = (clientX: number) => {
      const offset = offsetFromPointer(clientX);
      setVisualPosition(offset);
      setCurrentSec(offset);
      lastSecondRef.current = Math.floor(offset);
    };

    previewAt(e.clientX);

    const onMove = (ev: PointerEvent) => {
      previewAt(ev.clientX);
    };

    const finish = (ev: PointerEvent) => {
      try {
        el.releasePointerCapture(ev.pointerId);
      } catch {
        /* noop */
      }
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", finish);
      el.removeEventListener("pointercancel", finish);
      draggingRef.current = false;
      seekToOffset(offsetFromPointer(ev.clientX));
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", finish);
    el.addEventListener("pointercancel", finish);
  };

  const onBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!anyStem || durationRef.current <= 0) return;
    const dur = durationRef.current;
    const cur = pendingOffsetRef.current ||
      (playingRef.current
        ? (getAudioContext().currentTime - startTimeRef.current) % dur
        : 0);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      seekToOffset(Math.min(dur, cur + 5));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekToOffset(Math.max(0, cur - 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      seekToOffset(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seekToOffset(Math.max(0, dur - 0.1));
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <article
      className="grid md:grid-cols-[minmax(70px,90px)_1fr] gap-4 md:gap-6 pt-[30px] pb-[26px]"
      style={{ borderTop: "1px solid rgba(42,23,30,0.18)" }}
    >
      <div className="font-mono font-semibold text-[10px] tabular-nums tracking-[0.18em] uppercase text-[color:var(--ink-3)] md:pt-1.5">
        {String(index + 1).padStart(2, "0")} / demo
      </div>

      <div>
        <h4 className="font-editorial italic text-[23px] leading-[1.25] text-[color:var(--ink)] mb-2">
          {demo.title}
        </h4>
        <p className="font-mono text-[14px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[52ch] mb-[18px]">
          {demo.caption}
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggle}
            disabled={!anyStem || loading}
            className="btn btn-sm btn-pill min-w-[74px] disabled:opacity-30"
          >
            {loading ? "…" : playing ? "stop" : "play"}
          </button>

          <div
            ref={progressBarRef}
            role="slider"
            aria-label={`scrub ${demo.title}`}
            aria-valuenow={duration > 0 ? Math.round((currentSec / duration) * 100) : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-disabled={!anyStem || undefined}
            tabIndex={anyStem ? 0 : -1}
            onPointerDown={onBarPointerDown}
            onKeyDown={onBarKeyDown}
            className={`flex-1 h-6 flex items-center relative touch-none select-none ${
              anyStem ? "cursor-pointer" : ""
            }`}
          >
            <div
              className="absolute inset-x-0 h-px"
              style={{ background: "rgba(42,23,30,0.32)" }}
            />
            <div
              ref={progressFillRef}
              className="absolute h-px top-1/2 -translate-y-1/2 left-0 bg-[color:var(--accent-deep)]"
              style={{ width: "0%" }}
            />
            <div
              ref={progressKnobRef}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[color:var(--accent-deep)] rounded-full"
              style={{ left: "0%", opacity: anyStem ? 1 : 0 }}
            />
          </div>

          <span className="font-mono text-[11px] tabular-nums text-[color:var(--ink-3)] w-[88px] text-right">
            {anyStem
              ? `${formatTime(currentSec)} / ${formatTime(duration)}`
              : "0:00 / 0:00"}
          </span>
        </div>

        {anyStem && (
          <div className="mt-3 flex items-baseline gap-4 font-mono font-semibold text-[10px] uppercase tracking-[0.16em]">
            <span className="text-[9px] tracking-[0.18em] text-[color:var(--ink-4)]">mode</span>
            {MODE_ORDER.map((m) => {
              const enabled = !!stemUrl(demo, m);
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={!enabled}
                  onClick={() => setMode(m)}
                  className={`pb-0.5 border-b transition-colors duration-[120ms] ease-editorial disabled:opacity-30 disabled:cursor-not-allowed ${
                    isActive
                      ? "text-[color:var(--ink)] border-[color:var(--ink)]"
                      : "text-[color:var(--ink-3)] border-transparent hover:text-[color:var(--ink)]"
                  }`}
                >
                  {MODE_LABELS[m]}
                </button>
              );
            })}
          </div>
        )}

        {!anyStem && (
          <p className="mt-3 font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-4)]">
            audio coming soon
          </p>
        )}
      </div>
    </article>
  );
};

export default AudioDemo;

import { useCallback, useEffect, useRef, useState } from "react";
import type { PluginDemo } from "@/data/plugins";
import {
  claimPlayback,
  getAnalyser,
  getAudioContext,
  loadAudioBuffer,
  releasePlayback,
  unlockAudio,
} from "@/lib/audioPlayback";

type Props = {
  demo: PluginDemo;
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

/* The playback level bars: five log-spaced bands over the shared analyser's
 * 128 bins (fftSize 256 ≈ 187Hz per bin) — lows on the left, air on the
 * right. EQ_REST is the "signal off" height the CSS also uses. */
const EQ_BANDS: ReadonlyArray<readonly [number, number]> = [
  [1, 4],
  [4, 10],
  [10, 24],
  [24, 56],
  [56, 118],
];
const EQ_REST = 0.12;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AudioDemo = ({ demo }: Props) => {
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
  // The level-bar elements, written to directly from the rAF tick (no React
  // state on the audio frame). Reduced-motion captured once per mount.
  const eqBarsRef = useRef<Array<HTMLElement | null>>([]);
  const freqDataRef = useRef<Uint8Array | null>(null);
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion();
  }, []);

  const availableModes = MODE_ORDER.filter((m) => !!stemUrl(demo, m));
  const anyStem = availableModes.length > 0;

  /* A radiogroup is a single tab stop that the arrow keys move through — say
     "radio, 1 of 3" to a screen reader and then ignore ArrowRight and you have
     lied about the control. Selection follows focus, per the APG. */
  const onModeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = availableModes.indexOf(mode);
    if (i < 0) return;
    const last = availableModes.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setMode(availableModes[next]);
    (e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)')[next])?.focus();
  };

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
    // Bars fall back to the CSS resting height ("signal off").
    for (const el of eqBarsRef.current) {
      if (el) el.style.transform = "";
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

      // Through the shared analyser so the level bars see the mix.
      source.connect(gain).connect(getAnalyser());
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

    // Drive the level bars from the live spectrum — direct scaleY writes on
    // the frame we already own. Skipped under reduced motion (bars stay at
    // their resting height).
    if (!reducedMotionRef.current) {
      const analyser = getAnalyser();
      let data = freqDataRef.current;
      if (!data || data.length !== analyser.frequencyBinCount) {
        data = new Uint8Array(analyser.frequencyBinCount);
        freqDataRef.current = data;
      }
      analyser.getByteFrequencyData(data);
      for (let b = 0; b < EQ_BANDS.length; b++) {
        const el = eqBarsRef.current[b];
        if (!el) continue;
        const [lo, hi] = EQ_BANDS[b];
        let sum = 0;
        for (let i = lo; i < hi; i++) sum += data[i];
        // Perceptual lift (x^0.7) so quiet detail still registers.
        const v = Math.min(1, Math.pow(sum / ((hi - lo) * 255), 0.7) * 1.25);
        el.style.transform = `scaleY(${(EQ_REST + (1 - EQ_REST) * v).toFixed(3)})`;
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
      className="pt-[30px] pb-[26px]"
      style={{ borderTop: "1px solid rgba(42,23,30,0.18)" }}
    >
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

          {anyStem && (
            /* the pulse: five bars breathing with the actual signal */
            <span aria-hidden="true" className="eq shrink-0 hidden sm:inline-flex">
              {EQ_BANDS.map((_, i) => (
                <i
                  key={i}
                  ref={(el) => {
                    eqBarsRef.current[i] = el;
                  }}
                />
              ))}
            </span>
          )}
        </div>

        {/* A three-way toggle, so the group is a radiogroup: the underline and
            the ink weight say which stem is playing to anyone looking at it,
            and aria-checked says the same thing to anyone who isn't. The
            buttons carry their own padding — as bare 15px-wide labels they
            were the smallest hit targets on the site. */}
        {anyStem && (
          <div
            role="radiogroup"
            aria-label={`playback stem for ${demo.title}`}
            onKeyDown={onModeKeyDown}
            className="mt-3 flex items-center gap-2 font-mono font-semibold text-[10px] uppercase tracking-[0.16em]"
          >
            <span className="text-[10px] tracking-[0.18em] text-[color:var(--ink-3)] mr-2">
              mode
            </span>
            {MODE_ORDER.map((m) => {
              const enabled = !!stemUrl(demo, m);
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  disabled={!enabled}
                  onClick={() => setMode(m)}
                  className={`min-h-[30px] px-2 pb-0.5 border-b transition-colors duration-[120ms] ease-editorial disabled:opacity-30 disabled:cursor-not-allowed ${
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
          <p className="mt-3 font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-3)]">
            audio coming soon
          </p>
        )}
      </div>
    </article>
  );
};

export default AudioDemo;

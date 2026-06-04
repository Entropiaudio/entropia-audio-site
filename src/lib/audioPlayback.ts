/**
 * Shared audio plumbing for the demo player.
 *
 * - Single AudioContext per page (cheap, but only one is allowed by most
 *   browsers without explicit user gesture so we lazy-init on first call).
 * - Decoded AudioBuffers cached by URL so a user toggling modes or replaying
 *   the same demo doesn't refetch + redecode the WAVs.
 * - Module-level "active demo" registry enforces mutual exclusion: clicking
 *   play on demo B stops whatever demo A was playing.
 */

let _ctx: AudioContext | null = null;
let _unlocked = false;

export const getAudioContext = (): AudioContext => {
  if (_ctx) return _ctx;
  type W = typeof window & { webkitAudioContext?: typeof AudioContext };
  const w = window as W;
  const Ctor = window.AudioContext || w.webkitAudioContext;
  _ctx = new Ctor();
  return _ctx;
};

/** iOS Safari needs a silent buffer played from inside the first user gesture
 *  to engage its audio session, and `resume()` must be CALLED (not just
 *  awaited) synchronously in that gesture. Otherwise the long fetch/decode
 *  that follows will let the session auto-suspend and `source.start()` ends
 *  up scheduled into a dead context. Returns the resume promise so the caller
 *  can await it before scheduling real playback. */
export const unlockAudio = (): Promise<void> => {
  const ctx = getAudioContext();
  if (!_unlocked) {
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      _unlocked = true;
    } catch {
      /* best-effort; ignore */
    }
  }
  if (ctx.state === "suspended") return ctx.resume();
  return Promise.resolve();
};

const bufferCache = new Map<string, Promise<AudioBuffer>>();

export const loadAudioBuffer = (url: string): Promise<AudioBuffer> => {
  const cached = bufferCache.get(url);
  if (cached) return cached;
  const ctx = getAudioContext();
  const p = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`fetch failed: ${r.status} ${url}`);
      return r.arrayBuffer();
    })
    .then((ab) => ctx.decodeAudioData(ab))
    .catch((err) => {
      // Don't poison the cache, let the next attempt retry.
      bufferCache.delete(url);
      throw err;
    });
  bufferCache.set(url, p);
  return p;
};

/** Singleton "currently playing demo" stop function. Calling claimPlayback
 *  with a new stop fn stops the previous owner first. */
let activeStop: (() => void) | null = null;

export const claimPlayback = (stop: () => void) => {
  if (activeStop && activeStop !== stop) {
    const previous = activeStop;
    activeStop = stop;
    previous();
  } else {
    activeStop = stop;
  }
};

export const releasePlayback = (stop: () => void) => {
  if (activeStop === stop) activeStop = null;
};

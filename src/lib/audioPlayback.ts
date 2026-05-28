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

export const getAudioContext = (): AudioContext => {
  if (_ctx) return _ctx;
  type W = typeof window & { webkitAudioContext?: typeof AudioContext };
  const w = window as W;
  const Ctor = window.AudioContext || w.webkitAudioContext;
  _ctx = new Ctor();
  return _ctx;
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

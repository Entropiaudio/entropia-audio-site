import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Router-level scroll behaviour, which react-router doesn't provide:
 *
 *   - a new page starts at the top (without this, following a link from
 *     halfway down one page drops you halfway down the next one);
 *   - a link carrying a hash lands on that section, including when the hash
 *     points at a page you weren't on ("get the demo" → /plugins/chaosverb#try).
 *
 * The target is re-measured a few times: the first pass runs before webfonts
 * swap and before images below the fold have their intrinsic size, either of
 * which moves the anchor by hundreds of pixels. Re-asserting on `load` (and
 * once shortly after) lands on the section rather than near it.
 *
 * The top-of-page reset is forced non-smooth — `html { scroll-behavior:
 * smooth }` would otherwise animate the whole document back up on every
 * navigation.
 */
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      const html = document.documentElement;
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previous;
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];

    const settle = (behavior: ScrollBehavior) => {
      const target = document.getElementById(id);
      if (!target) return false;
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top), behavior });
      return true;
    };

    // first pass as soon as the route has committed; then correct for late
    // layout once everything has loaded.
    timers.push(window.setTimeout(() => settle(smooth ? "smooth" : "auto"), 0));
    timers.push(window.setTimeout(() => settle("auto"), 300));
    const onLoad = () => settle("auto");
    if (document.readyState === "complete") timers.push(window.setTimeout(onLoad, 600));
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;

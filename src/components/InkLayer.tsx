import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import { InkItem, eraseFor } from "@/data/inkMarks";
import { getInkPages, subscribeInkPages } from "@/lib/inkStore";
import { inkMarkWidthPx } from "./ink/inkGeometry";
import { inkPageKey } from "./ink/inkRoutes";

/**
 * The hand-placed brush marks from the design handoff, rendered read-only.
 *
 * Each mark is pinned to a [data-ink-anchor] section and positioned as
 * fractions of that section's box, so placements survive any viewport width.
 * Three depths, as specified:
 *
 *   bg    — under the paper, a stain in the stock. Where the anchor paints no
 *           ground of its own it goes in this component's mount, which sits
 *           above the backdrop and below every section. Where the anchor does
 *           paint a ground (the tan bands), nothing behind it could ever read,
 *           so the mark drops to an overlay *inside* that ground, beneath the
 *           mid overlay — the studio makes the same substitution when a bg
 *           mark lands somewhere covered.
 *   mid    — above the section's paper, below its content. A percentage-
 *           positioned overlay inside the anchor; the section's own children
 *           are lifted a hair so they paint over it.
 *   front  — above content, type included. One shell-level wrapper, pixel-
 *           positioned against the anchor rects (marks may overhang clipped
 *           sections, so they can't live inside them), kept fresh by a
 *           ResizeObserver.
 *
 * No container carries a z-index: a stacking context isolates blending, and a
 * multiply that can't see the parchment under it is just a grey rectangle.
 * Paint order comes from DOM order instead — backdrop (z-0), this mount, then
 * main (z-10) — and the front marks escape main by carrying z-index themselves.
 * The studio's front layer *is* z-isolated, which is why it has to collapse a
 * page's front marks to one shared blend; here each keeps the blend it was
 * given, so home's darken and multiply can disagree and both still composite.
 *
 * Marks with erase strokes draw to a canvas: source ink, then the strokes
 * punched out with destination-out, same math as the studio.
 */

const imgCache = new Map<string, Promise<HTMLImageElement>>();
const loadImg = (src: string): Promise<HTMLImageElement> => {
  let p = imgCache.get(src);
  if (!p) {
    p = new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });
    imgCache.set(src, p);
  }
  return p;
};

const markTransform = (it: InkItem) =>
  `translate(-50%,-50%) rotate(${it.rot}deg) scale(${it.fx ? -1 : 1},${it.fy ? -1 : 1})`;

/** Draw an erased mark: the ink at `targetPx` width, then each stroke punched
 *  out. Stroke radius/blur/points are fractions of the mark's own box. */
const paintErased = async (it: InkItem, el: HTMLCanvasElement, targetPx: number) => {
  let img: HTMLImageElement;
  try {
    img = await loadImg(it.src);
  } catch {
    return;
  }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const target = Math.min(img.naturalWidth, Math.max(600, Math.round(targetPx * dpr)));
  const k = target / img.naturalWidth;
  const cw = Math.max(2, Math.round(img.naturalWidth * k));
  const ch = Math.max(2, Math.round(img.naturalHeight * k));
  el.width = cw;
  el.height = ch;
  const x = el.getContext("2d");
  if (!x) return;
  x.clearRect(0, 0, cw, ch);
  x.drawImage(img, 0, 0, cw, ch);
  x.globalCompositeOperation = "destination-out";
  x.lineJoin = "round";
  x.lineCap = "round";
  for (const st of eraseFor(it) ?? []) {
    const lw = Math.max(1, st.r * 2 * cw);
    const blur = Math.max(0, (st.soft || 0) * st.r * cw);
    x.filter = blur > 0.4 ? `blur(${blur}px)` : "none";
    x.lineWidth = lw;
    x.strokeStyle = "#000";
    x.fillStyle = "#000";
    const pts = st.pts;
    if (pts.length === 1) {
      x.beginPath();
      x.arc(pts[0][0] * cw, pts[0][1] * ch, lw / 2, 0, Math.PI * 2);
      x.fill();
    } else {
      x.beginPath();
      x.moveTo(pts[0][0] * cw, pts[0][1] * ch);
      for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0] * cw, pts[i][1] * ch);
      x.stroke();
    }
  }
  x.filter = "none";
  x.globalCompositeOperation = "source-over";
};

const makeMarkEl = (it: InkItem): HTMLElement => {
  const erased = !!eraseFor(it)?.length;
  const el = document.createElement(erased ? "canvas" : "img") as HTMLElement;
  if (!erased) {
    (el as HTMLImageElement).src = it.src;
    (el as HTMLImageElement).alt = "";
    (el as HTMLImageElement).loading = "lazy";
    (el as HTMLImageElement).decoding = "async";
  }
  el.style.cssText =
    "position:absolute;display:block;height:auto;transform-origin:50% 50%;pointer-events:none;";
  el.style.opacity = String(it.op);
  el.style.mixBlendMode = it.blend;
  el.style.transform = markTransform(it);
  return el;
};

/* Front ink is a desktop luxury: it paints OVER type, which only works while
   there's whitespace beside the type to land on. Below this width every box
   is full of text, so front marks render at the mid depth instead — same
   spot, same blend, under the words rather than across them. (This is also
   the exact range where the hamburger menu exists, so demoted marks can never
   float over the open panel.) */
const NARROW_QUERY = "(max-width: 767px)";

const InkLayer = () => {
  const { pathname } = useLocation();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const page = inkPageKey(pathname);
  // Read through the store rather than the module: in production it hands back
  // INK_PAGES and never notifies, in dev the editor swaps it live.
  const pages = useSyncExternalStore(subscribeInkPages, getInkPages, getInkPages);
  const items = page ? pages[page] : undefined;

  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const root = host?.parentElement;
    if (!host || !root || !items?.length) return;

    const cleanups: Array<() => void> = [];
    // Every element this run creates, so the next run can take them all back
    // out. Overlays and the front wrapper are removed wholesale below, but the
    // marks that go straight into the mount (bg marks with no ground of their
    // own, and the __page ones) live in a div React keeps across effect runs —
    // without this they stack up one full set per re-run, and a multiply mark
    // painted a hundred times over itself is just a black smear.
    const created: HTMLElement[] = [];
    host.replaceChildren(); // heal anything a previous run leaked (HMR)
    const overlayFor = new Map<Element, Partial<Record<"bg" | "mid", HTMLDivElement>>>();
    const anchorOf = (label: string): HTMLElement | null =>
      label === "__page"
        ? root
        : root.querySelector<HTMLElement>(`[data-ink-anchor="${label}"]`);

    // A "ground" is whatever paints a section's paper. Mid marks belong on it —
    // over the ground, under the content — and a ground opaque enough to answer
    // true here is also what makes a bg mark behind the section unreadable.
    // Ported from the studio, which uses the same test.
    const hasGround = (el: Element): boolean => {
      const cs = getComputedStyle(el);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
      const m = (cs.backgroundColor || "").match(/rgba?\(([^)]+)\)/);
      if (m) {
        const p = m[1].split(",").map(Number);
        if ((p[3] == null ? 1 : p[3]) > 0.02) return true;
      }
      return false;
    };
    // Direct children only. The studio scanned the whole subtree but sorted its
    // design-system paper classes first; without those to go on, a deep scan
    // happily returns a content plate (Fiction's interface shot fills 78% of
    // its section), and then every fraction is measured against the wrong box
    // and the mark paints under an opaque image. A section either paints its
    // own paper or hands that job to one wrapper.
    const groundOf = (section: HTMLElement): HTMLElement => {
      if (hasGround(section)) return section;
      const area = section.getBoundingClientRect();
      const a0 = area.width * area.height;
      for (const kid of section.children) {
        const el = kid as HTMLElement;
        if (!hasGround(el)) continue;
        const r = el.getBoundingClientRect();
        if (a0 && r.width * r.height >= a0 * 0.65) return el;
      }
      return section;
    };

    // Section overlays: percentage-positioned inside the section's ground, with
    // the ground's own content lifted just above (position:relative +
    // z-index:1), so ink sits on the paper and under the text/plates. A ground
    // that clips (the torn sheet) clips its ink with it.
    //
    // Two of them per ground at most: the bg overlay goes in first so it paints
    // under the mid one — that's the whole difference between home's two
    // el-4-1 marks, one brush reading twice at two depths.
    const sectionOverlay = (ground: HTMLElement, depth: "bg" | "mid"): HTMLDivElement => {
      let ov = overlayFor.get(ground)?.[depth];
      if (!ov) {
        ov = document.createElement("div");
        ov.setAttribute(depth === "bg" ? "data-ink-bg" : "data-ink-mid", "");
        ov.setAttribute("aria-hidden", "true");
        ov.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:visible;";
        if (getComputedStyle(ground).position === "static") ground.style.position = "relative";
        for (const kid of ground.children) {
          const el = kid as HTMLElement;
          if (el === ov || el.hasAttribute("data-ink-mid") || el.hasAttribute("data-ink-bg"))
            continue;
          const cs = getComputedStyle(el);
          if (cs.zIndex !== "auto" || hasGround(el)) continue;
          if (cs.position === "static") el.style.position = "relative";
          el.style.zIndex = "1";
        }
        // bg first, mid last: with no z-index on either, DOM order is depth
        if (depth === "bg") ground.insertBefore(ov, ground.firstChild);
        else ground.appendChild(ov);
        const slot = overlayFor.get(ground) ?? {};
        slot[depth] = ov;
        overlayFor.set(ground, slot);
        cleanups.push(() => ov!.remove());
      }
      return ov;
    };

    // front marks: one shell-level wrapper, appended last so it paints over
    // main. It keeps z-index auto so each mark's blend reaches the page instead
    // of being isolated inside a stacking context — which is why home's darken
    // and multiply marks can disagree here and still both composite.
    let front: HTMLDivElement | null = null;
    const frontBox = (): HTMLDivElement => {
      if (!front) {
        front = document.createElement("div");
        front.setAttribute("data-ink-front", "");
        front.setAttribute("aria-hidden", "true");
        front.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
        root.appendChild(front);
        cleanups.push(() => front!.remove());
      }
      return front;
    };

    /** Marks living in a shell-level layer, so their box has to be measured
     *  against the anchor rather than inherited from it. */
    const pinned: Array<{ it: InkItem; el: HTMLElement }> = [];
    /** Marks living inside an overlay (or the mount): centre stays a CSS
     *  percentage of that box, but width is set in px by the layout pass so
     *  the phone-size boost in inkMarkWidthPx applies to every depth. */
    const flowed: Array<{ it: InkItem; el: HTMLElement }> = [];
    const erasedMarks: Array<{ it: InkItem; el: HTMLCanvasElement; painted: number }> = [];

    const place = (el: HTMLElement, box: HTMLElement, it: InkItem) => {
      el.style.left = `${it.x * 100}%`;
      el.style.top = `${it.y * 100}%`;
      box.appendChild(el);
      flowed.push({ it, el });
    };

    for (const [i, raw] of items.entries()) {
      const it: InkItem =
        narrow && raw.layer === "front" ? { ...raw, layer: "mid" } : raw;
      const anchor = anchorOf(it.anchor);
      if (!anchor) continue; // section not on this page (e.g. moonbase still loading)
      const el = makeMarkEl(it);
      el.setAttribute("data-ink-i", String(i)); // the editor finds marks by this
      created.push(el);
      if (it.layer === "front") {
        el.style.zIndex = "20";
        frontBox().appendChild(el);
        pinned.push({ it, el });
      } else if (it.layer === "bg" && anchor !== root && !hasGround(groundOf(anchor))) {
        // nothing paints over this section, so the mark can genuinely sit
        // under it — in the mount, measured against the anchor
        host.appendChild(el);
        pinned.push({ it, el });
      } else if (anchor === root) {
        place(el, host, it); // __page marks share the mount's box
      } else {
        place(el, sectionOverlay(groundOf(anchor), it.layer === "bg" ? "bg" : "mid"), it);
      }
      if (eraseFor(it)?.length) {
        erasedMarks.push({ it, el: el as HTMLCanvasElement, painted: 0 });
      }
    }

    // pixel layout for the shell-level marks + canvas repaints, shared by resize
    let raf = 0;
    const layout = () => {
      raf = 0;
      const base = root.getBoundingClientRect();
      for (const { it, el } of pinned) {
        const anchor = anchorOf(it.anchor);
        if (!anchor) continue;
        const a = anchor.getBoundingClientRect();
        el.style.left = `${a.left - base.left + it.x * a.width}px`;
        el.style.top = `${a.top - base.top + it.y * a.height}px`;
        el.style.width = `${inkMarkWidthPx(it.w, a.width, it.lockToAnchor)}px`;
      }
      for (const { it, el } of flowed) {
        const box = el.parentElement;
        if (!box) continue;
        el.style.width = `${inkMarkWidthPx(it.w, box.getBoundingClientRect().width, it.lockToAnchor)}px`;
      }
      for (const m of erasedMarks) {
        const w = m.el.getBoundingClientRect().width || 600;
        // repaint only when meaningfully sharper output is needed
        if (w > m.painted * 1.4 || m.painted === 0) {
          m.painted = w;
          void paintErased(m.it, m.el, w);
        }
      }
    };
    const requestLayout = () => {
      if (!raf) raf = requestAnimationFrame(layout);
    };
    // Mount, resize and font-swap dress the marks synchronously: a pending
    // rAF is only a promise of a frame, and documents that aren't getting
    // frames (prerender, background tabs, embedded previews) queue it
    // indefinitely — until it runs, every pinned mark is an unplaced 0×0 box.
    // The pass is a handful of rect reads, cheap enough to run in the event.
    // The ResizeObserver keeps the coalescing rAF path: it only ever fires in
    // frame-producing documents, and it can storm while content settles.
    let disposed = false;
    const layoutNow = () => {
      if (disposed) return;
      if (raf) cancelAnimationFrame(raf);
      layout();
    };

    layoutNow();
    const ro = new ResizeObserver(requestLayout);
    ro.observe(root);
    window.addEventListener("resize", layoutNow);
    if (document.fonts?.ready) void document.fonts.ready.then(layoutNow);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", layoutNow);
      for (const el of created) el.remove();
      for (const fn of cleanups) fn();
    };
  }, [items, narrow]);

  if (!items?.length) return null;
  // No z-index on the mount, on purpose: it would isolate the marks' blending
  // from the parchment underneath and every multiply would flatten to a grey
  // patch. DOM order already puts it after the backdrop and before main.
  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-ink-root
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

export default InkLayer;

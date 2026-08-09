import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import { ERASE, INK_PAGES, InkItem } from "@/data/inkMarks";
import { getInkPages, setInkPages, subscribeInkPages } from "@/lib/inkStore";
import { inkPageKey } from "./inkRoutes";
import { BRUSHES, LAYERS, BLENDS, inkCollision, markBox, type Box, type InkVerdict } from "./inkGeometry";

/**
 * Direct manipulation for the ink marks — dev only.
 *
 * The page itself is the preview: dragging writes to the ink store, InkLayer
 * re-renders from it, so what you position is literally what ships. Save
 * rewrites the placement block of src/data/inkMarks.ts through the dev
 * server's /__ink/save endpoint.
 *
 * The thing it exists to prevent: a mark that lands on reading text. That is
 * the one rule the ink system is strict about, and it is not obvious by eye at
 * one viewport width. The selected mark is continuously tested — real ink
 * alpha against real glyph boxes — and the badge turns red the moment any
 * inked pixel touches type.
 */

const PANEL_W = 292;
const ACCENT = "#C9683A";

type Draft = Record<string, InkItem[]>;

const shell = (): HTMLElement | null =>
  document.querySelector<HTMLElement>("[data-ink-root]")?.parentElement ?? null;

const anchorEl = (label: string): HTMLElement | null => {
  const root = shell();
  if (!root) return null;
  return label === "__page" ? root : root.querySelector<HTMLElement>(`[data-ink-anchor="${label}"]`);
};

const round = (n: number, dp = 4) => Math.round(n * 10 ** dp) / 10 ** dp;

/** Stable empty list, so a page with no marks doesn't churn the hooks below. */
const NONE: InkItem[] = [];

const POS_KEY = "entropia.ink.panelPos";
const EDGE = 12;

/** Keep the panel fully on screen — a tool you can lose off the edge is worse
 *  than one in the way. */
const clampPanel = (x: number, y: number) => {
  const maxX = Math.max(EDGE, window.innerWidth - PANEL_W - EDGE);
  return {
    x: Math.min(Math.max(x, EDGE), maxX),
    y: Math.min(Math.max(y, EDGE), Math.max(EDGE, window.innerHeight - 90)),
  };
};

const rightEdge = () => clampPanel(window.innerWidth - PANEL_W - EDGE, EDGE);

const InkEditor = () => {
  const { pathname } = useLocation();
  const page = inkPageKey(pathname);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<(Box | null)[]>([]);
  const [hit, setHit] = useState<InkVerdict | null>(null);
  const [anchorsOnPage, setAnchorsOnPage] = useState<string[]>(["__page"]);
  // Where the panel sits. Remembered, because the marks it covers are always
  // the same ones (the page-anchored pair lives on the right margin) and
  // re-dragging it every reload gets old fast.
  const [panelPos, setPanelPos] = useState(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      const p = raw ? JSON.parse(raw) : null;
      if (p && typeof p.x === "number" && typeof p.y === "number") return clampPanel(p.x, p.y);
    } catch {
      /* corrupt or blocked storage — fall through to the default corner */
    }
    return rightEdge();
  });

  // Subscribed, not just read: the store is the single source for both the
  // marks on screen and the panel, so a change from either stays in step and
  // `items` keeps a stable identity between renders.
  const draft = useSyncExternalStore(subscribeInkPages, getInkPages, getInkPages);
  const items = useMemo(() => (page ? draft[page] ?? NONE : NONE), [page, draft]);

  const commit = useCallback(
    (next: InkItem[]) => {
      if (!page) return;
      setInkPages({ ...getInkPages(), [page]: next });
      setDirty(true);
      setStatus(null);
    },
    [page],
  );

  const patch = useCallback(
    (i: number, fields: Partial<InkItem>) => {
      const next = items.map((m, k) => (k === i ? { ...m, ...fields } : m));
      commit(next);
    },
    [items, commit],
  );

  /* ---- the panel itself: drag by the title bar, snap with the button ---- */
  const panelDrag = useRef<{ dx: number; dy: number } | null>(null);

  const onPanelDown = (e: React.PointerEvent) => {
    e.preventDefault();
    panelDrag.current = { dx: e.clientX - panelPos.x, dy: e.clientY - panelPos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPanelMove = (e: React.PointerEvent) => {
    const d = panelDrag.current;
    if (!d) return;
    setPanelPos(clampPanel(e.clientX - d.dx, e.clientY - d.dy));
  };
  const onPanelUp = (e: React.PointerEvent) => {
    if (panelDrag.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    panelDrag.current = null;
  };

  /** Jump to whichever side the panel isn't on — the fast way to uncover a
   *  mark hiding underneath without aiming. */
  const flipSide = () =>
    setPanelPos((p) =>
      clampPanel(p.x > window.innerWidth / 2 - PANEL_W / 2 ? EDGE : window.innerWidth - PANEL_W - EDGE, p.y),
    );

  useEffect(() => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(panelPos));
    } catch {
      /* storage blocked — position just won't persist */
    }
  }, [panelPos]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => setPanelPos((p) => clampPanel(p.x, p.y));
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [open]);

  /* ---- toggle: Shift+I anywhere, or ?ink=1 ---- */
  useEffect(() => {
    if (new URLSearchParams(location.search).has("ink")) setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (!typing && e.shiftKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  /* ---- keep the handle overlay glued to the anchors ---- */
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let last = "";
    const measure = () => {
      const next = items.map((m) => markBox(m, anchorEl(m.anchor)));
      const sig = JSON.stringify(next);
      if (sig !== last) {
        last = sig;
        setBoxes(next);
      }
      raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [open, items]);

  /* ---- does the selected mark touch type? ---- */
  useEffect(() => {
    if (!open || sel == null || !items[sel]) {
      setHit(null);
      return;
    }
    const id = setTimeout(() => setHit(inkCollision(sel, items[sel])), 120);
    return () => clearTimeout(id);
  }, [open, sel, items]);

  /* ---- drag / resize / rotate ---- */
  const dragRef = useRef<{ mode: "move" | "size" | "rot"; i: number; box: Box; ax: DOMRect; x0: number; y0: number; m: InkItem } | null>(null);

  const onPointerDown = (e: React.PointerEvent, i: number, mode: "move" | "size" | "rot") => {
    e.preventDefault();
    e.stopPropagation();
    setSel(i);
    const m = items[i];
    const a = anchorEl(m.anchor);
    const box = boxes[i];
    if (!a || !box) return;
    dragRef.current = { mode, i, box, ax: a.getBoundingClientRect(), x0: e.clientX, y0: e.clientY, m };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (d.mode === "move") {
      patch(d.i, {
        x: round(d.m.x + dx / d.ax.width),
        y: round(d.m.y + dy / d.ax.height),
      });
    } else if (d.mode === "size") {
      // drag away from centre grows the mark
      const grow = (dx + dy) / 2;
      patch(d.i, { w: round(Math.max(0.01, d.m.w + (grow * 2) / d.ax.width)) });
    } else {
      const cx = d.box.cx;
      const cy = d.box.cy;
      const a0 = Math.atan2(d.y0 - cy, d.x0 - cx);
      const a1 = Math.atan2(e.clientY - cy, e.clientX - cx);
      let deg = d.m.rot + ((a1 - a0) * 180) / Math.PI;
      if (!e.shiftKey) deg = Math.round(deg); // shift for fine angles
      patch(d.i, { rot: round(((deg + 540) % 360) - 180, 1) });
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (dragRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already gone */
      }
    }
    dragRef.current = null;
  };

  /* ---- arrow-key nudge ---- */
  useEffect(() => {
    if (!open || sel == null) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const m = items[sel];
      const a = anchorEl(m?.anchor ?? "");
      if (!m || !a) return;
      const r = a.getBoundingClientRect();
      const step = e.shiftKey ? 10 : 1;
      const map: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        patch(sel, { x: round(m.x + d[0] / r.width), y: round(m.y + d[1] / r.height) });
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        commit(items.filter((_, k) => k !== sel));
        setSel(null);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, sel, items, patch, commit]);

  // Rescanned on a timer, not once: Moonbase resolves after first paint and
  // some sections only exist afterwards, so the anchor list grows late.
  useEffect(() => {
    if (!open) return;
    const scan = () => {
      const root = shell();
      const found = root
        ? [...root.querySelectorAll("[data-ink-anchor]")].map((e) => e.getAttribute("data-ink-anchor")!)
        : [];
      const next = ["__page", ...new Set(found)];
      setAnchorsOnPage((prev) => (prev.join(" ") === next.join(" ") ? prev : next));
    };
    scan();
    const id = setInterval(scan, 1000);
    return () => clearInterval(id);
  }, [open, pathname]);

  const save = async () => {
    setStatus("saving…");
    try {
      const res = await fetch("/__ink/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pages: getInkPages() }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setDirty(false);
      setStatus(`saved ${json.total} marks → inkMarks.ts`);
    } catch (err) {
      setStatus(`save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const reset = () => {
    setInkPages(INK_PAGES);
    setDirty(false);
    setSel(null);
    setStatus("reverted to the committed file");
  };

  const add = () => {
    const m: InkItem = {
      src: `/ink/${BRUSHES[0]}.webp`,
      anchor: anchorsOnPage[1] ?? "__page",
      layer: "mid",
      x: 0.5,
      y: 0.5,
      w: 0.13,
      rot: 0,
      op: 0.75,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "New mark — say why it is here.",
    };
    commit([...items, m]);
    setSel(items.length);
  };

  if (!open) {
    return (
      <button
        type="button"
        data-ink-ui
        onClick={() => setOpen(true)}
        title="Ink editor (Shift+I)"
        style={{
          position: "fixed",
          left: 12,
          bottom: 12,
          zIndex: 2147483000,
          font: "600 10px/1 ui-monospace, monospace",
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "#F4E6D2",
          background: "#2A171E",
          border: `1px solid ${ACCENT}`,
          borderRadius: 999,
          padding: "7px 12px",
          cursor: "pointer",
          opacity: 0.72,
        }}
      >
        ink
      </button>
    );
  }

  const s = sel != null ? items[sel] : null;
  const lab: React.CSSProperties = {
    font: "600 9px/1 ui-monospace, monospace",
    letterSpacing: ".14em",
    textTransform: "uppercase",
    color: "#B9A899",
    display: "block",
    marginBottom: 4,
  };
  const field: React.CSSProperties = {
    width: "100%",
    background: "#1B1014",
    color: "#F4E6D2",
    border: "1px solid #4A3038",
    borderRadius: 4,
    padding: "5px 7px",
    font: "12px/1.3 ui-monospace, monospace",
    boxSizing: "border-box",
  };
  const btn: React.CSSProperties = {
    ...field,
    width: "auto",
    cursor: "pointer",
    background: "#2A171E",
    padding: "6px 10px",
  };

  return (
    <>
      {/* handles */}
      <div
        data-ink-ui
        style={{ position: "fixed", inset: 0, zIndex: 2147482000, pointerEvents: "none" }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((m, i) => {
          const b = boxes[i];
          if (!b) return null;
          const on = i === sel;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.cx,
                top: b.cy,
                width: b.w,
                height: b.h,
                transform: `translate(-50%,-50%) rotate(${m.rot}deg)`,
                transformOrigin: "50% 50%",
                border: `1px ${on ? "solid" : "dashed"} ${on ? ACCENT : "rgba(42,23,30,.42)"}`,
                background: on ? "rgba(201,104,58,.10)" : "transparent",
                pointerEvents: "auto",
                cursor: "move",
                touchAction: "none",
              }}
              onPointerDown={(e) => onPointerDown(e, i, "move")}
            >
              <span
                style={{
                  position: "absolute",
                  top: -17,
                  left: 0,
                  font: "600 9px/1 ui-monospace, monospace",
                  letterSpacing: ".1em",
                  color: on ? ACCENT : "rgba(42,23,30,.55)",
                  whiteSpace: "nowrap",
                }}
              >
                {i} {m.src.split("/").pop()?.replace(".webp", "")}
              </span>
              {on && (
                <>
                  <span
                    onPointerDown={(e) => onPointerDown(e, i, "size")}
                    style={{
                      position: "absolute",
                      right: -6,
                      bottom: -6,
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      background: ACCENT,
                      cursor: "nwse-resize",
                      touchAction: "none",
                    }}
                  />
                  <span
                    onPointerDown={(e) => onPointerDown(e, i, "rot")}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: -22,
                      width: 12,
                      height: 12,
                      marginLeft: -6,
                      borderRadius: 999,
                      background: ACCENT,
                      cursor: "grab",
                      touchAction: "none",
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* panel */}
      <div
        data-ink-ui
        style={{
          position: "fixed",
          left: panelPos.x,
          top: panelPos.y,
          width: PANEL_W,
          maxHeight: `calc(100vh - ${panelPos.y + EDGE}px)`,
          zIndex: 2147483000,
          background: "#241419",
          border: `1px solid ${ACCENT}`,
          borderRadius: 6,
          boxShadow: "0 12px 40px rgba(0,0,0,.45)",
          color: "#F4E6D2",
          font: "12px/1.45 ui-monospace, monospace",
          overflowY: "auto",
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        <div
          onPointerDown={onPanelDown}
          onPointerMove={onPanelMove}
          onPointerUp={onPanelUp}
          onPointerCancel={onPanelUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
            marginBottom: 10,
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
          }}
          title="Drag to move the panel"
        >
          <strong style={{ font: "600 11px/1 ui-monospace, monospace", letterSpacing: ".16em", textTransform: "uppercase" }}>
            <span style={{ opacity: 0.5, marginRight: 6 }}>⠿</span>
            ink · {page ?? "clean"}
          </strong>
          <span style={{ display: "flex", gap: 4 }}>
            <button
              type="button"
              onClick={flipSide}
              onPointerDown={(e) => e.stopPropagation()}
              title="Snap to the other side"
              style={{ ...btn, padding: "3px 8px" }}
            >
              ⇆
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
              title="Close (Shift+I)"
              style={{ ...btn, padding: "3px 8px" }}
            >
              ✕
            </button>
          </span>
        </div>

        {!page && (
          <p style={{ color: "#B9A899" }}>
            This route is deliberately clean (cart, account, legal, and unreleased plugin pages carry no ink).
          </p>
        )}

        {page && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={add} style={btn}>
                + add
              </button>
              <button
                type="button"
                disabled={sel == null}
                onClick={() => {
                  if (sel == null) return;
                  commit([...items, { ...items[sel], x: round(items[sel].x + 0.02) }]);
                  setSel(items.length);
                }}
                style={{ ...btn, opacity: sel == null ? 0.4 : 1 }}
              >
                duplicate
              </button>
              <button
                type="button"
                disabled={sel == null}
                onClick={() => {
                  if (sel == null) return;
                  commit(items.filter((_, k) => k !== sel));
                  setSel(null);
                }}
                style={{ ...btn, opacity: sel == null ? 0.4 : 1 }}
              >
                delete
              </button>
            </div>

            <ol style={{ listStyle: "none", margin: "0 0 12px", padding: 0 }}>
              {items.map((m, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setSel(i)}
                    style={{
                      ...field,
                      textAlign: "left",
                      cursor: "pointer",
                      marginBottom: 3,
                      borderColor: i === sel ? ACCENT : "#4A3038",
                      background: i === sel ? "#331E26" : "#1B1014",
                    }}
                  >
                    {i} · {m.src.split("/").pop()?.replace(".webp", "")} · {m.layer} · {m.anchor}
                  </button>
                </li>
              ))}
              {!items.length && <li style={{ color: "#B9A899" }}>no marks on this page</li>}
            </ol>

            {s && sel != null && (
              <div style={{ borderTop: "1px solid #4A3038", paddingTop: 10 }}>
                {hit && (
                  <p
                    style={{
                      margin: "0 0 10px",
                      padding: "6px 8px",
                      borderRadius: 4,
                      background: hit.level === "bad" ? "#5A1A1A" : "#1D3324",
                      border: `1px solid ${hit.level === "bad" ? "#C2483C" : "#3E7A50"}`,
                      color: hit.level === "bad" ? "#FFD9D4" : "#CFE8D6",
                      font: "11px/1.4 ui-monospace, monospace",
                    }}
                  >
                    {hit.level === "bad" ? "⚠ " : "✓ "}
                    {hit.note}
                    {hit.texts.length > 0 && (
                      <span style={{ opacity: 0.72 }}> — {hit.texts.join(" · ")}</span>
                    )}
                  </p>
                )}

                <label style={lab}>brush</label>
                <select
                  value={s.src.split("/").pop()!.replace(".webp", "")}
                  onChange={(e) => patch(sel, { src: `/ink/${e.target.value}.webp` })}
                  style={{ ...field, marginBottom: 8 }}
                >
                  {BRUSHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <label style={lab}>anchor</label>
                <select
                  value={s.anchor}
                  onChange={(e) => patch(sel, { anchor: e.target.value })}
                  style={{ ...field, marginBottom: 8 }}
                >
                  {[...new Set([s.anchor, ...anchorsOnPage])].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={lab}>depth</label>
                    <select value={s.layer} onChange={(e) => patch(sel, { layer: e.target.value as InkItem["layer"] })} style={field}>
                      {LAYERS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={lab}>blend</label>
                    <select value={s.blend} onChange={(e) => patch(sel, { blend: e.target.value })} style={field}>
                      {BLENDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(
                  [
                    ["x", -1.5, 1.5, 0.001],
                    ["y", -1.5, 1.5, 0.001],
                    ["w", 0.01, 0.8, 0.001],
                    ["rot", -180, 180, 0.1],
                    ["op", 0, 1, 0.01],
                  ] as const
                ).map(([k, lo, hi, st]) => (
                  <div key={k} style={{ marginBottom: 7 }}>
                    <label style={lab}>
                      {k} — {s[k]}
                    </label>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="range"
                        min={lo}
                        max={hi}
                        step={st}
                        value={s[k]}
                        onChange={(e) => patch(sel, { [k]: round(+e.target.value) } as Partial<InkItem>)}
                        style={{ flex: 1, accentColor: ACCENT }}
                      />
                      <input
                        type="number"
                        step={st}
                        value={s[k]}
                        onChange={(e) => patch(sel, { [k]: round(+e.target.value) } as Partial<InkItem>)}
                        style={{ ...field, width: 74 }}
                      />
                    </div>
                  </div>
                ))}

                <label style={lab}>erasure</label>
                <select
                  value={s.eraseRef ?? ""}
                  onChange={(e) => patch(sel, { eraseRef: e.target.value || undefined })}
                  style={{ ...field, marginBottom: 8 }}
                >
                  <option value="">none</option>
                  {Object.keys(ERASE).map((k) => (
                    <option key={k} value={k}>
                      {k} ({ERASE[k].length} strokes)
                    </option>
                  ))}
                </select>

                <label style={lab}>note (kept as a comment)</label>
                <textarea
                  value={s.note ?? ""}
                  onChange={(e) => patch(sel, { note: e.target.value })}
                  rows={3}
                  style={{ ...field, resize: "vertical", marginBottom: 10 }}
                />
              </div>
            )}

            <div style={{ borderTop: "1px solid #4A3038", paddingTop: 10, display: "flex", gap: 6, alignItems: "center" }}>
              <button
                type="button"
                onClick={save}
                disabled={!dirty}
                style={{ ...btn, borderColor: dirty ? ACCENT : "#4A3038", opacity: dirty ? 1 : 0.5 }}
              >
                save to file
              </button>
              <button type="button" onClick={reset} style={btn}>
                revert
              </button>
            </div>
            {status && <p style={{ color: "#B9A899", margin: "8px 0 0" }}>{status}</p>}
            <p style={{ color: "#7E6B5F", margin: "10px 0 0", font: "10px/1.5 ui-monospace, monospace" }}>
              drag to move · corner scales · knob above rotates (shift = fine) · arrows nudge, shift ×10 ·
              delete removes · shift+I hides. Drag this panel by its title bar, or ⇆ to send it to the
              other side when it covers a mark. Saving rewrites only the placement block of inkMarks.ts;
              erase strokes and the file header are untouched. New erase brushwork still belongs in the
              design studio.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default InkEditor;

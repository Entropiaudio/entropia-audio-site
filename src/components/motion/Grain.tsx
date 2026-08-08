/**
 * Fixed-position SVG noise overlay. Multiply-blended paper grain — the thing
 * that makes the parchment read as material instead of a flat fill. One pass
 * for the whole site — the tan bands and the hero collage take their grain
 * from this overlay rather than each carrying their own, so the texture never
 * doubles where grounds meet. Tile and strength live in index.css
 * (--grain-img / --grain-scale / --grain-amt). Pointer-events disabled.
 */
const Grain = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-[55] mix-blend-multiply"
    style={{
      opacity: "var(--grain-amt)",
      backgroundImage: "var(--grain-img)",
      backgroundSize: "var(--grain-scale) var(--grain-scale)",
    }}
  />
);

export default Grain;

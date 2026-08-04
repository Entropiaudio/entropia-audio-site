/**
 * Fixed-position SVG noise overlay. Multiply-blended paper grain — the thing
 * that makes the parchment read as material instead of a flat fill.
 * Pointer-events disabled.
 */
const Grain = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-[55] mix-blend-multiply opacity-[0.10]"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      backgroundSize: "200px 200px",
    }}
  />
);

export default Grain;

/**
 * Fixed-position SVG noise overlay. Adds analog grain to the warm-dark canvas.
 * Pointer-events disabled. Honors reduced-motion via static frame.
 */
const Grain = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-[55] mix-blend-overlay opacity-[0.06]"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      backgroundSize: "200px 200px",
    }}
  />
);

export default Grain;

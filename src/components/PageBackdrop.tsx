/**
 * The page collage, minus the paint: three torn parchment bands, a skewed
 * copper hatch column, the travelling rule with its bead, and (at the foot)
 * the plum wedge and the single pink fleck.
 *
 * Everything here is geometry, not imagery — it scales to any page height and
 * costs nothing to load. The painted hero collage is a separate, deliberate
 * one-off on the home page.
 *
 * Mount it as the first child of a `relative` page shell; it pins itself to
 * the shell's box and never takes pointer events.
 */
interface PageBackdropProps {
  /** Render the footer furniture — the plum wedge and the pink fleck. */
  foot?: boolean;
  /** Drop the plum wedge but keep the fleck (pages that end on a tan band). */
  plum?: boolean;
  /** Where the travelling rule crosses, from the top of the shell. */
  ruleTop?: number;
}

const PageBackdrop = ({ foot = true, plum = true, ruleTop = 124 }: PageBackdropProps) => (
  <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* the three torn bands — a hair off horizontal, like laid paper */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(178.3deg, #F9E7D1 0 33%, #F0DFC2 33.1% 63%, #DCC1A0 63.1% 100%)",
      }}
    />

    {/* the hatch column, skewed to the brand pitch */}
    <div
      className="absolute top-0 bottom-0 right-[6.5%] w-[78px] opacity-40"
      style={{ transform: "skewX(-12deg)", backgroundImage: "var(--hatch-column)" }}
    />

    {/* the travelling rule and its bead */}
    <div
      className="absolute left-0 right-[5.5%] h-px opacity-70"
      style={{
        top: ruleTop,
        background: "var(--accent-raw)",
        transform: "rotate(-1.72deg)",
        transformOrigin: "left center",
      }}
    />
    <div
      className="absolute left-[61%] w-[9px] h-[9px] rounded-full opacity-85"
      style={{ top: `calc(${ruleTop - 4}px - 1.83vw)`, background: "var(--accent-raw)" }}
    />

    {foot && (
      <div className="absolute inset-x-0 bottom-0 h-[340px]">
        {plum && (
          <div
            className="absolute right-0 bottom-0 w-[clamp(140px,17vw,300px)] opacity-90"
            style={{
              aspectRatio: "4.705",
              background: "var(--plum-block)",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
        )}
        <div
          className="absolute left-[3.2vw] bottom-[22px] w-[26px] h-[8px] opacity-85"
          style={{ background: "var(--pop)", transform: "skewX(-12deg)" }}
        />
      </div>
    )}
  </div>
);

export default PageBackdrop;

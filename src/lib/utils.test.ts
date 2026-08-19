import { describe, expect, it } from "vitest";
import { cn } from "./utils";

/* The extended tailwind-merge config in utils.ts is what keeps the fluid type
   scale alive through cn(): stock tailwind-merge reads an unknown text-* class
   as a colour, so a size + tone pair silently drops the size. A typo in the
   "fluid-" validator wouldn't throw — it would quietly bring that back,
   site-wide. These pins fail loudly instead. */
describe("cn fluid font-size merging", () => {
  it("keeps a fluid size next to a text colour (different groups)", () => {
    expect(cn("text-fluid-10", "text-[color:var(--ink-3)]")).toBe(
      "text-fluid-10 text-[color:var(--ink-3)]",
    );
  });

  it("lets a fluid size supersede a fixed one (same group)", () => {
    expect(cn("text-[15px]", "text-fluid-15")).toBe("text-fluid-15");
  });

  it("handles the dotted sizes", () => {
    expect(cn("text-[13.5px]", "text-fluid-13.5")).toBe("text-fluid-13.5");
  });
});

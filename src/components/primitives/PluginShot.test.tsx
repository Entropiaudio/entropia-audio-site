/**
 * The skin flip: the plate's first paint loads only the shot it shows, the
 * other skin mounts hidden behind it once that has painted, and flipping
 * `src` swaps which layer is the visible, described one — no new download.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PluginShot from "./PluginShot";

const NIGHT = "/screenshots/x-dark.webp";
const DAY = "/screenshots/x-light.webp";
const size = { w: 1800, h: 1120 };

const imgs = (container: HTMLElement) => [...container.querySelectorAll("img")];

describe("PluginShot with skins", () => {
  it("loads only the shown skin until it has painted", () => {
    const { container } = render(
      <PluginShot src={NIGHT} alternates={[NIGHT, DAY]} size={size} alt="X interface" />,
    );
    expect(imgs(container).map((i) => i.getAttribute("src"))).toEqual([NIGHT]);

    fireEvent.load(screen.getByAltText("X interface"));
    const after = imgs(container);
    expect(after.map((i) => i.getAttribute("src"))).toEqual([NIGHT, DAY]);
    // the preloaded skin is invisible and silent
    expect(after[1]).toHaveAttribute("aria-hidden", "true");
    expect(after[1]).toHaveAttribute("alt", "");
    expect(after[1].style.opacity).toBe("0");
  });

  it("flips to the other skin without remounting either layer", () => {
    const { container, rerender } = render(
      <PluginShot src={NIGHT} alternates={[NIGHT, DAY]} size={size} alt="X interface" />,
    );
    fireEvent.load(screen.getByAltText("X interface"));
    const [night, day] = imgs(container);

    rerender(<PluginShot src={DAY} alternates={[NIGHT, DAY]} size={size} alt="X interface" />);
    expect(imgs(container)).toEqual([night, day]);
    expect(screen.getByAltText("X interface")).toBe(day);
    expect(day.style.opacity).toBe("1");
    expect(night).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a plain shot unchanged when there are no alternates", () => {
    const { container } = render(<PluginShot src={DAY} size={size} alt="X interface" />);
    fireEvent.load(screen.getByAltText("X interface"));
    expect(imgs(container)).toHaveLength(1);
  });
});

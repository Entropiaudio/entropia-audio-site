/**
 * The home card for a plugin that isn't out yet: no money, the status chip,
 * and both actions landing on the product's own preview page. Entropan is
 * the newest such product, so it is the one under test — the same card used
 * to hard-code Fiction as the only unreleased case.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

// the card imports the Moonbase SDK for its "try free" action; the test
// never gets there, and the SDK must not boot in jsdom
vi.mock("@/lib/moonbase", () => ({
  Moonbase: { download_product: vi.fn(), on: vi.fn() },
  MoonbaseEvent: {},
  moonbaseUrl: undefined,
  DISPLAY_CURRENCY: "USD",
}));

import PluginCard from "./PluginCard";
import { getPlugin } from "@/data/plugins";
import { copy } from "@/copy";

describe("PluginCard for an in-development plugin", () => {
  const plugin = getPlugin("entropan")!;
  const c = copy.entropan.card;

  it("shows the product's own card copy and no price", () => {
    render(
      <MemoryRouter>
        <PluginCard plugin={plugin} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: plugin.name })).toHaveAttribute("href", "/plugins/entropan");
    expect(screen.getByText(c.status)).toBeInTheDocument();
    expect(screen.getByText(c.tagline)).toBeInTheDocument();
    expect(screen.getByText(c.blurb)).toBeInTheDocument();
    expect(screen.getByText(c.price)).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).toBeNull();
  });

  it("sends both actions to the preview page", () => {
    render(
      <MemoryRouter>
        <PluginCard plugin={plugin} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: c.primaryButton })).toHaveAttribute("href", "/plugins/entropan");
    expect(screen.getByRole("link", { name: c.secondaryButton })).toHaveAttribute(
      "href",
      "/plugins/entropan#notify",
    );
  });
});

/**
 * The home card, both ways: a released plugin shows its price and a trial
 * action (Entropan, the newest one), and a plugin that isn't out yet shows
 * no money and sends both actions to its preview page (Fiction). The card
 * used to hard-code those two cases by name.
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

const renderCard = (slug: string) =>
  render(
    <MemoryRouter>
      <PluginCard plugin={getPlugin(slug)!} />
    </MemoryRouter>,
  );

describe("PluginCard for a released plugin", () => {
  const plugin = getPlugin("entropan")!;
  const c = copy.entropan.card;

  it("shows the product's own card copy with its fallback price", () => {
    renderCard("entropan");
    expect(screen.getByRole("link", { name: plugin.name })).toHaveAttribute("href", "/plugins/entropan");
    expect(screen.getByText(c.status)).toBeInTheDocument();
    expect(screen.getByText(c.tagline)).toBeInTheDocument();
    expect(screen.getByText(c.blurb)).toBeInTheDocument();
    expect(screen.getByText(`$${plugin.price}`)).toBeInTheDocument();
    // not on sale: no sale note, no "coming soon"
    expect(screen.queryByText(c.saleNote)).toBeNull();
    expect(screen.queryByText(copy.fiction.card.price)).toBeNull();
  });

  it("links to the product page and offers the trial as a Moonbase action", () => {
    renderCard("entropan");
    expect(screen.getByRole("link", { name: c.primaryButton })).toHaveAttribute("href", "/plugins/entropan");
    expect(screen.getByRole("button", { name: c.secondaryButton })).toBeInTheDocument();
  });
});

describe("PluginCard for an in-development plugin", () => {
  const plugin = getPlugin("fiction")!;
  const c = copy.fiction.card;

  it("shows the product's own card copy and no price", () => {
    renderCard("fiction");
    expect(screen.getByRole("link", { name: plugin.name })).toHaveAttribute("href", "/plugins/fiction");
    expect(screen.getByText(c.status)).toBeInTheDocument();
    expect(screen.getByText(c.tagline)).toBeInTheDocument();
    expect(screen.getByText(c.blurb)).toBeInTheDocument();
    expect(screen.getByText(c.price)).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).toBeNull();
  });

  it("sends both actions to the preview page", () => {
    renderCard("fiction");
    expect(screen.getByRole("link", { name: c.primaryButton })).toHaveAttribute("href", "/plugins/fiction");
    expect(screen.getByRole("link", { name: c.secondaryButton })).toHaveAttribute(
      "href",
      "/plugins/fiction#notify",
    );
  });
});

// Live plugin pricing, sourced from Moonbase so the product page and cards
// can't drift from what the cart actually charges.
//
// Prices come from the storefront event mirror (lib/moonbase-state.ts) in USD.
// The static `fallback` (from data/plugins.ts) is used until the first
// StorefrontUpdated tick lands — so there's never a $0 flash on first paint.
import { useSyncExternalStore } from "react";
import {
  getPricingSnapshot,
  subscribePricing,
  type PluginPricing,
} from "@/lib/moonbase-state";

export type { PluginPricing };

export const usePluginPricing = (slug: string, fallback: PluginPricing): PluginPricing => {
  const live = useSyncExternalStore(subscribePricing, getPricingSnapshot);
  const p = live[slug];
  // Hold the static price until Moonbase has a real (> 0) number for this slug.
  if (!p || p.price <= 0) return fallback;
  return p;
};

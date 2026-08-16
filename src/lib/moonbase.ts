/**
 * Moonbase embedded-storefront bootstrap.
 *
 * Single point of contact with `@moonbase.sh/storefront`. Moonbase is the only
 * backend for accounts, cart, and checkout — VITE_MOONBASE_URL is REQUIRED. If
 * it's unset the SDK never boots and the storefront is non-functional (the
 * production build also hard-fails without it, see vite.config.ts).
 *
 * Manual steps required before this does anything:
 *   1. Provision a Moonbase account; copy the storefront URL
 *      (e.g. https://entropiaudio.moonbase.sh).
 *   2. Whitelist this site's origins (prod, deploy preview, localhost:8080)
 *      in the Moonbase dashboard.
 *   3. Set VITE_MOONBASE_URL in .env.local (and in Netlify env for prod).
 */

// 2.8.0 ships proper types for the default export, so the error-suppression
// directive that used to sit on this import is gone (tsc flagged it unused).
import Moonbase, { MoonbaseEvent } from "@moonbase.sh/storefront";

export { Moonbase, MoonbaseEvent };

export const moonbaseUrl = import.meta.env.VITE_MOONBASE_URL as string | undefined;

/**
 * The storefront presents all prices in USD, regardless of the shopper's
 * geo-suggested currency. Moonbase ships a price for every enabled currency
 * on each product (e.g. `{ USD: 36, ILS: 105 }`), so the site just selects
 * the USD entry — see lib/moonbase-state.ts.
 *
 * Caveat: Moonbase settles *checkout* in the order's own currency, which it
 * derives from the storefront's `suggestedCurrency` (a geo/dashboard setting
 * the embedded SDK exposes no override for). To make the embedded checkout
 * drawer match this USD presentation for every visitor, set USD as the
 * storefront's default currency in the Moonbase dashboard.
 */
export const DISPLAY_CURRENCY = "USD";

let started = false;

/**
 * Boot Moonbase once on app start. Theming pins to the closest match for the
 * site's parchment daylight theme, the Moonbase modal/checkout UI still
 * renders inside its own DOM tree with its own fonts, so this is the best we
 * can do without dropping to a Custom Integration build.
 */
export const initMoonbase = () => {
  if (started) return;
  if (!moonbaseUrl) {
    // Required in every environment. Production builds hard-fail without it
    // (vite.config.ts); in dev this warns loudly instead of silently rendering
    // a non-functional storefront.
    if (typeof console !== "undefined") {
      console.error(
        "[entropia] VITE_MOONBASE_URL is not set — the storefront (accounts, cart, " +
          "checkout) will not function. Set it in .env.local.",
      );
    }
    return;
  }
  started = true;
  // setup() is async; we don't await because the rest of the app boots fine
  // before Moonbase's first storefront fetch completes, the event mirror
  // will fill in user/cart/orders when StorefrontUpdated fires.
  void Moonbase.setup(moonbaseUrl, {
    toolbar: {
      enabled: false,
    },
    checkout: {
      // Mount in-page rather than redirecting to the hosted portal.
      redirect: false,
    },
    cart: {
      quantity: "selectable",
    },
    theme: {
      // Daylight register: light surfaces + the burnt-copper accent. The
      // modal renders in its own DOM tree, so this is the closest match the
      // embedded SDK allows without a Custom Integration build.
      dark: false,
      colors: {
        primary: "#DD6E26",
        background: "gray",
      },
      fonts: {
        heading: "PT Serif",
        body: "Inter",
      },
      corners: "sharp",
      buttons: "outlined",
      cards: "outlined",
    },
  });
};

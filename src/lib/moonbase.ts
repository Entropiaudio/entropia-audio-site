/**
 * Moonbase embedded-storefront bootstrap.
 *
 * Single point of contact with `@moonbase.sh/storefront`. When VITE_MOONBASE_URL
 * is unset the SDK never boots, and the rest of the site falls back to the
 * localStorage prototype AuthContext / CartContext, useful for local dev
 * without a Moonbase account.
 *
 * Manual steps still required before this does anything:
 *   1. Provision a Moonbase account; copy the storefront URL
 *      (e.g. https://entropiaudio.moonbase.sh).
 *   2. Whitelist this site's origins (prod, deploy preview, localhost:8080)
 *      in the Moonbase dashboard.
 *   3. Set VITE_MOONBASE_URL in .env.local (and in Netlify env for prod).
 */

// @ts-expect-error, @moonbase.sh/storefront has no bundled type re-exports for the default.
import Moonbase, { MoonbaseEvent } from "@moonbase.sh/storefront";

export { Moonbase, MoonbaseEvent };

export const moonbaseUrl = import.meta.env.VITE_MOONBASE_URL as string | undefined;
export const isMoonbaseEnabled = Boolean(moonbaseUrl);

let started = false;

/**
 * Boot Moonbase once on app start. Theming pins to the closest match for the
 * site's editorial dark theme, the Moonbase modal/checkout UI still renders
 * inside its own DOM tree with its own fonts, so this is the best we can do
 * without dropping to a Custom Integration build.
 */
export const initMoonbase = () => {
  if (started || !moonbaseUrl) return;
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
      dark: true,
      colors: {
        // Site accent (warm sand). The closest Moonbase fonts to the site's
        // editorial display + sans are PT Serif and Inter.
        primary: "#D4A574",
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

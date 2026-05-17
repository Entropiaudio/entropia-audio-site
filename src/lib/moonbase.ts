/**
 * Moonbase embedded-storefront bootstrap.
 *
 * Moonbase ships a single JS package (@moonbase.sh/storefront) that, once
 * `setup()` is called with the account URL, renders auth / cart / checkout /
 * license-activation UI on demand. This wrapper makes the boot a no-op when
 * VITE_MOONBASE_URL is unset, so dev environments without an account keep
 * running on the local AuthContext / CartContext fallbacks.
 *
 * Manual steps still required before this does anything:
 *   1. Provision a Moonbase account, copy its base URL (e.g. https://acme.moonbase.sh).
 *   2. Add the site's deployment + dev origins to the account's whitelisted domains.
 *   3. Set VITE_MOONBASE_URL in .env.local (see .env.example).
 */

// @ts-expect-error — @moonbase.sh/storefront has no bundled types yet.
import Moonbase from "@moonbase.sh/storefront";

export const moonbaseUrl = import.meta.env.VITE_MOONBASE_URL as string | undefined;
export const isMoonbaseEnabled = Boolean(moonbaseUrl);

let started = false;

export const initMoonbase = () => {
  if (started || !moonbaseUrl) return;
  started = true;
  Moonbase.setup(moonbaseUrl);
};

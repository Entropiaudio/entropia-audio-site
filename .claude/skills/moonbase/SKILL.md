---
name: moonbase
description: How the Moonbase embedded storefront works in this site — the only backend for accounts, cart, checkout, licences, and downloads. Read before touching auth, cart, pricing, checkout, activation, or anything under src/lib/moonbase*, src/context/, or the Cart/Checkout/Account/Activate/OrderSuccess pages.
user-invocable: false
---

# Moonbase embedded storefront

`@moonbase.sh/storefront` is the **only** backend this site has. There is no API of our
own, no database, no session server. Accounts, cart, checkout, licences, and product
downloads all live in Moonbase. The former localStorage prototype (mock auth with a
djb2 password store, local cart) was deleted — **do not reintroduce a local fallback**.

The SDK ships no bundled type re-exports for its default, hence the single
`@ts-expect-error` at the top of [src/lib/moonbase.ts](../../../src/lib/moonbase.ts).
Its runtime surface is wide and zod-inferred; treat it as untyped and defensive.

## Integration shape — "path B"

The site keeps its own marketing, cart, account, and checkout *pages*. Moonbase's modal
owns the actual transactions: sign-in, sign-up, cart mutation, payment, account
management, activation, downloads.

```
@moonbase.sh/storefront
        │  MoonbaseEvent.*  (StorefrontUpdated, SignedIn/Up/Out,
        │                    AddedToCart, CheckoutCompleted, CheckoutClosed)
        ▼
src/lib/moonbase-state.ts        ← event mirror; four tiny stores
        │  user · cart · pricing · ready
        ▼  useSyncExternalStore
AuthContext · CartContext · usePluginPricing
        ▼
components + pages               ← read state, fire intents
```

Boot happens once in [src/main.tsx](../../../src/main.tsx): `initMoonbase()` then
`bindMoonbaseEvents()`. Both are idempotent.

## Files

| File | Role |
|---|---|
| [src/lib/moonbase.ts](../../../src/lib/moonbase.ts) | single point of contact with the SDK: `initMoonbase()`, theme config, `DISPLAY_CURRENCY`, `moonbaseUrl` |
| [src/lib/moonbase-state.ts](../../../src/lib/moonbase-state.ts) | the event mirror — subscribes to `MoonbaseEvent.*`, projects into stores |
| [src/context/AuthContext.tsx](../../../src/context/AuthContext.tsx) | `user`, `isAuthed` + intent-firing actions |
| [src/context/CartContext.tsx](../../../src/context/CartContext.tsx) | `items`, `count`, `subtotal` + `add()` |
| [src/hooks/usePluginPricing.ts](../../../src/hooks/usePluginPricing.ts) | live USD price per slug, with a static fallback |

## Non-obvious behaviours

These are the things that will bite you.

**The cart is read from `localStorage`, not from an event payload.** The SDK persists
its authoritative order to `localStorage["moonbase_session"]` on every change, exposes
no public read-API, and the `StorefrontUpdated` payload doesn't include cart contents.
So `refreshCartFromStorage()` re-hydrates from storage on every relevant tick, and a
`storage` event listener mirrors cross-tab mutations. If the cart ever looks stale,
that's the path to check.

**Actions that "do nothing" are deliberate seams.** The SDK exposes no programmatic
primitive for cart quantity/remove/clear, or for sign-out and credential edits. Those
context methods open the relevant Moonbase modal instead (`view_cart()`,
`view_account()`) so the site's own buttons still lead somewhere. `attachOrder()` is an
intentional no-op. Don't "fix" these into local mutations — that would fork state away
from the real backend.

**Prices are presented in USD, but checkout settles in the order's own currency.**
`DISPLAY_CURRENCY = "USD"`, and `moneyAmount()` tries USD first, then the session
currency, then anything numeric. Moonbase derives the order currency from the
storefront's `suggestedCurrency` (a geo/dashboard setting the embedded SDK gives no
override for) — so USD must be set as the storefront default in the Moonbase dashboard
for the drawer to match the site. Pricing keys off the product `id`, which is the same
slug used by `/plugins/:slug` routes and cart lines.

**`usePluginPricing` holds a static fallback until Moonbase reports a price > 0**, so
there's never a `$0` flash on first paint. Fallbacks live in
[src/data/plugins.ts](../../../src/data/plugins.ts).

**The user projection is deliberately thin.** `mapMoonbaseUser` fills only `id`,
`email`, `createdAt`; `licenses` and `orders` stay empty arrays because the embedded SDK
doesn't surface them (they sit behind separate REST endpoints). The Account page
delegates the whole thing to `Moonbase.view_account()`. Keep the fields on the `User`
type — the page's shape depends on them — but don't try to populate them from the SDK.

**Mapping is defensive on purpose.** `asString` / `asNumber` / `asArray` /
`moneyAmount` / `productSlug` all fall through to sensible defaults rather than
throwing, because the SDK's shapes vary between enriched and bare line items. Preserve
that style in any new mapping.

## SDK intents in use

`sign_in({email?})` · `sign_up({email?})` · `view_account()` · `view_cart()` ·
`add_to_cart({product_id, quantity, show_cart})` · `checkout()` ·
`download_product({product_id})` · `activate_product({token?})`

Events consumed: `StorefrontUpdated`, `SignedIn`, `SignedUp`, `SignedOut`,
`AddedToCart`, `CheckoutCompleted`, `CheckoutClosed`.

## Configuration

`VITE_MOONBASE_URL` (e.g. `https://entropiaudio.moonbase.sh`) is **required in every
environment**:

- unset in dev → `initMoonbase()` logs a loud console error and the SDK never boots;
- unset in a production build → [vite.config.ts](../../../vite.config.ts) **throws**,
  by design, so a broken storefront can't deploy silently;
- Netlify needs it under *site settings → environment variables*, and env changes do
  not retroactively rebuild — trigger a fresh deploy.

Every embedding origin must be whitelisted in *Moonbase admin → settings →
integration*: production, the Netlify default URL, and `http://localhost:8080`.

## Security constraints

The site's core security claim ([SECURITY.md](../../../SECURITY.md)) is that it never
touches credentials or card data — payment runs inside Moonbase's own iframe. So:

- **Never add a form that collects a password or card details.** Forward the email to
  the Moonbase modal as a prefill and let it own the rest.
- The CSP in [public/_headers](../../../public/_headers) pins `script-src` and
  `form-action` to `'self'` plus the **exact** tenant host — not a `*.moonbase.sh`
  wildcard, because moonbase.sh is multi-tenant and another tenant serving script into
  our origin would be an XSS gadget. `connect-src` / `frame-src` keep the wildcard
  deliberately (they don't execute script). If a checkout flow breaks after deploy,
  read the blocked origin from the CSP violation and add it to `frame-src` /
  `connect-src` — never loosen `script-src`.
- Checkout can't be exercised from local dev, so changes to the checkout path need
  care: they're only truly verifiable in a deploy preview.

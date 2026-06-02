/**
 * Moonbase event mirror.
 *
 * Subscribes to MoonbaseEvent.* lifecycle events and projects them into the
 * shape the site's existing AuthContext / CartContext already use, so
 * consumer components don't change when Path B (delegate backend, keep site
 * UI) is wired up.
 *
 * Three projected stores:
 *   - userSnapshot    → User | null (id, email; licenses + orders stay empty
 *                                    because the embedded SDK doesn't expose
 *                                    them — the Account page delegates to
 *                                    `Moonbase.view_account()` instead)
 *   - cartSnapshot    → CartItem[]  (slug, name, price, license, quantity)
 *   - readySnapshot   → boolean     (has Moonbase delivered at least one
 *                                    StorefrontUpdated yet)
 *
 * Mapping is intentionally defensive, the Moonbase API surface is wide,
 * zod-inferred, and we only need a handful of fields for our UI. Unknown
 * shapes fall through to sensible defaults rather than throwing.
 */
import type { CartItem } from "@/context/CartContext";
import type { User } from "@/context/AuthContext";
import { DISPLAY_CURRENCY, isMoonbaseEnabled, Moonbase, MoonbaseEvent } from "./moonbase";

type Listener = () => void;

const makeStore = <T,>(initial: T) => {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set: (next: T) => {
      if (Object.is(value, next)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
};

/** USD-resolved pricing for a product slug, projected from the storefront so
 * the product page / cards advertise the same number the cart will charge. */
export type PluginPricing = { price: number; regularPrice: number };

const userStore = makeStore<User | null>(null);
const cartStore = makeStore<CartItem[]>([]);
const pricingStore = makeStore<Record<string, PluginPricing>>({});
const readyStore = makeStore<boolean>(false);

export const subscribeUser = userStore.subscribe;
export const getUserSnapshot = userStore.get;

export const subscribeCart = cartStore.subscribe;
export const getCartSnapshot = cartStore.get;

export const subscribePricing = pricingStore.subscribe;
export const getPricingSnapshot = pricingStore.get;

export const subscribeReady = readyStore.subscribe;
export const getReadySnapshot = readyStore.get;

const asString = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : v == null ? fallback : String(v);

const asNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

const asArray = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Pluck a per-currency amount out of either:
 *   - a `Record<currency, number>` (variation/line-item `price`, already in
 *     major units — `{ USD: 36, ILS: 105 }`, see kt() formatter in the SDK)
 *   - a `Money` `{ currency, amount }` (line-item `total.subtotal` etc., also
 *     major units)
 * Tries each currency in `prefer` order (USD first, see DISPLAY_CURRENCY),
 * then any Money amount, then the first numeric value. 0 when nothing matches. */
const moneyAmount = (m: unknown, prefer: readonly (string | null)[]): number => {
  if (typeof m === "number") return m;
  if (!m || typeof m !== "object") return 0;
  const obj = m as Record<string, unknown>;
  // Currency record: honour the preference order so USD wins even when the
  // order's own currency (and Moonbase's geo-suggested one) is something else.
  for (const c of prefer) {
    if (c && typeof obj[c] === "number") return obj[c] as number;
  }
  // Money shape: { currency, amount } — single fixed currency, can't reselect.
  if (typeof obj.amount === "number") return obj.amount;
  // Last resort: whatever currency Moonbase happened to ship first.
  for (const v of Object.values(obj)) {
    if (typeof v === "number") return v;
  }
  return 0;
};

/** Pull whichever name field Moonbase happens to expose for a product. */
const productSlug = (p: unknown, fallback = ""): string => {
  if (!p || typeof p !== "object") return fallback;
  const obj = p as Record<string, unknown>;
  return asString(obj.slug ?? obj.id ?? obj.productId ?? obj.product_id ?? obj.code, fallback);
};

const productName = (p: unknown, fallback = ""): string => {
  if (!p || typeof p !== "object") return fallback;
  const obj = p as Record<string, unknown>;
  return asString(obj.name ?? obj.title ?? obj.label, fallback);
};

const mapMoonbaseCartItem = (item: unknown, sessionCurrency: string | null): CartItem | null => {
  if (!item || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;
  // Enriched line items (see Storefront.enrichLineItems in the SDK) carry the
  // full `product` / `bundle` and `variation` objects alongside the raw line.
  // Bare server-side line items only carry `productId` / `variationId`.
  const product = obj.product ?? obj.bundle;
  const variation = obj.variation;
  const slug = productSlug(
    product ?? variation,
    asString(obj.productId ?? obj.bundleId ?? obj.product_id ?? obj.bundle_id, ""),
  );
  if (!slug) return null;
  // Present USD; fall back to the order's own currency, then anything, so a
  // missing USD entry never zeroes the line.
  const prefer = [DISPLAY_CURRENCY, sessionCurrency];
  // Prefer the enriched `price` record (already discount-applied by
  // applyToVariation), then variation.price, then derive from total.subtotal.
  const quantity = Math.max(1, asNumber(obj.quantity, 1));
  const total = obj.total as Record<string, unknown> | undefined;
  const subtotal = total?.subtotal;
  let price = moneyAmount(obj.price, prefer);
  if (price === 0 && variation && typeof variation === "object") {
    price = moneyAmount((variation as Record<string, unknown>).price, prefer);
  }
  if (price === 0 && subtotal) {
    price = moneyAmount(subtotal, prefer) / quantity;
  }
  return {
    slug,
    name: productName(product ?? variation, slug),
    price,
    license: "perpetual",
    quantity,
  };
};

// Moonbase user identity only. The embedded storefront SDK doesn't surface
// the rich license records or order history — those live behind separate
// REST endpoints. The site delegates all of that to `Moonbase.view_account()`
// (see Account.tsx), so `licenses` and `orders` here intentionally stay empty
// for the Moonbase path; they're populated only by the local prototype.
const mapMoonbaseUser = (u: unknown): User | null => {
  if (!u || typeof u !== "object") return null;
  const obj = u as Record<string, unknown>;
  const id = asString(obj.id, "");
  if (!id) return null;
  return {
    id,
    email: asString(obj.email, ""),
    createdAt: asString(obj.createdAt ?? obj.created_at, new Date().toISOString()),
    licenses: [],
    orders: [],
  };
};

/** The Moonbase SDK persists the authoritative cart (its `currentOrder`) to
 * `localStorage["moonbase_session"]` on every change. There's no public
 * read-API for it, and the StorefrontUpdated event payload doesn't include
 * cart contents — so we re-hydrate from storage on every relevant tick. */
const MOONBASE_SESSION_KEY = "moonbase_session";
let suggestedCurrency: string | null = null;

const readCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MOONBASE_SESSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown> | null;
    if (!parsed) return [];
    const currency = asString(parsed.currency, "") || suggestedCurrency;
    return asArray(parsed.items)
      .map((it) => mapMoonbaseCartItem(it, currency))
      .filter((x): x is CartItem => x !== null);
  } catch {
    return [];
  }
};

const refreshCartFromStorage = () => {
  const next = readCartFromStorage();
  // Avoid clobbering identity when nothing actually changed — shallow-compare
  // by length + per-line slug/qty/price so React renders stay cheap.
  const prev = cartStore.get();
  if (
    prev.length === next.length &&
    prev.every((p, i) =>
      p.slug === next[i].slug &&
      p.quantity === next[i].quantity &&
      p.price === next[i].price &&
      p.license === next[i].license,
    )
  ) {
    return;
  }
  cartStore.set(next);
};

/** Project per-product USD pricing from the storefront's product variations.
 * `price` is the sale figure (Moonbase folds discounts into `price`); the
 * crossed-out `regularPrice` comes from `originalPrice`. Keyed by product id —
 * the same slug the routes (`/plugins/:slug`) and cart lines use. */
const mapStorefrontPricing = (storefront: unknown): Record<string, PluginPricing> => {
  if (!storefront || typeof storefront !== "object") return {};
  const products = asArray((storefront as Record<string, unknown>).products);
  const prefer = [DISPLAY_CURRENCY, suggestedCurrency];
  const out: Record<string, PluginPricing> = {};
  for (const p of products) {
    if (!p || typeof p !== "object") continue;
    const obj = p as Record<string, unknown>;
    const slug = asString(obj.id, "");
    if (!slug) continue;
    const variation = (obj.defaultVariation ?? asArray(obj.variations)[0]) as
      | Record<string, unknown>
      | undefined;
    if (!variation) continue;
    const price = moneyAmount(variation.price, prefer);
    if (price <= 0) continue;
    const regular = moneyAmount(variation.originalPrice, prefer);
    out[slug] = { price, regularPrice: regular > price ? regular : price };
  }
  return out;
};

const samePricing = (
  a: Record<string, PluginPricing>,
  b: Record<string, PluginPricing>,
): boolean => {
  const ak = Object.keys(a);
  if (ak.length !== Object.keys(b).length) return false;
  return ak.every(
    (k) => b[k] && a[k].price === b[k].price && a[k].regularPrice === b[k].regularPrice,
  );
};

const refreshPricing = (storefront: unknown) => {
  const next = mapStorefrontPricing(storefront);
  if (!samePricing(pricingStore.get(), next)) pricingStore.set(next);
};

let bound = false;

/**
 * Idempotent, wire event listeners exactly once. Safe to call from anywhere,
 * but currently invoked from initMoonbase() in main.tsx via lib/moonbase.ts.
 */
export const bindMoonbaseEvents = () => {
  if (bound || !isMoonbaseEnabled) return;
  bound = true;

  Moonbase.on(MoonbaseEvent.StorefrontUpdated, (event: { storefront: unknown; user?: unknown }) => {
    userStore.set(mapMoonbaseUser(event.user));
    // Track the active currency for cart line-item price extraction. The SDK
    // sets currentOrder.currency = storefront.suggestedCurrency on each
    // storefront refresh, so this matches what the cart drawer renders.
    const storefront = (event.storefront as Record<string, unknown> | null) ?? null;
    if (storefront) {
      suggestedCurrency = asString(storefront.suggestedCurrency, "") || suggestedCurrency;
    }
    refreshPricing(event.storefront);
    refreshCartFromStorage();
    readyStore.set(true);
  });

  Moonbase.on(MoonbaseEvent.SignedIn, (event: { user: unknown }) => {
    const next = mapMoonbaseUser(event.user);
    if (next) userStore.set(next);
    refreshCartFromStorage();
  });

  Moonbase.on(MoonbaseEvent.SignedUp, (event: { user: unknown }) => {
    const next = mapMoonbaseUser(event.user);
    if (next) userStore.set(next);
    refreshCartFromStorage();
  });

  Moonbase.on(MoonbaseEvent.SignedOut, () => {
    userStore.set(null);
    cartStore.set([]);
  });

  Moonbase.on(MoonbaseEvent.CheckoutCompleted, (event: { order: unknown; user?: unknown }) => {
    // Optimistically clear the cart so the order-success redirect renders
    // cleanly; the next StorefrontUpdated tick will deliver the authoritative
    // user state. We don't keep the order locally — the Moonbase account
    // modal owns order history.
    cartStore.set([]);
    const next = mapMoonbaseUser(event.user);
    if (next) userStore.set(next);
  });

  Moonbase.on(MoonbaseEvent.AddedToCart, (event: { item: unknown; currency?: unknown }) => {
    // The SDK writes the new order to localStorage before dispatching this
    // event, so a fresh read always picks up the authoritative line, with
    // server-priced amounts and the right currency.
    const currency = asString(event.currency, "") || suggestedCurrency;
    if (currency) suggestedCurrency = currency;
    refreshCartFromStorage();
  });

  // Prime from storage so a hard refresh shows the cart instantly, before the
  // first StorefrontUpdated tick lands.
  refreshCartFromStorage();

  // Cross-tab sync: when another tab mutates the Moonbase session (add to
  // cart, drawer quantity change, sign out), mirror it here.
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === MOONBASE_SESSION_KEY) refreshCartFromStorage();
    });
  }
};

/** Helper for use in `useSyncExternalStore` SSR path. We're CSR-only, so
 * return the same as the regular snapshot. */
export const getServerSnapshot = () => null;

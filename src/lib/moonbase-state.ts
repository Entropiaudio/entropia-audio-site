/**
 * Moonbase event mirror.
 *
 * Subscribes to MoonbaseEvent.* lifecycle events and projects them into the
 * shape the site's existing AuthContext / CartContext already use, so
 * consumer components don't change when Path B (delegate backend, keep site
 * UI) is wired up.
 *
 * Three projected stores:
 *   - userSnapshot    → User | null (id, email, licenses[], orders[])
 *   - cartSnapshot    → CartItem[]  (slug, name, price, license, quantity)
 *   - readySnapshot   → boolean     (has Moonbase delivered at least one
 *                                    StorefrontUpdated yet)
 *
 * Mapping is intentionally defensive, the Moonbase API surface is wide,
 * zod-inferred, and we only need a handful of fields for our UI. Unknown
 * shapes fall through to sensible defaults rather than throwing.
 */
import type { CartItem } from "@/context/CartContext";
import type { License, Order, User } from "@/context/AuthContext";
import { isMoonbaseEnabled, Moonbase, MoonbaseEvent } from "./moonbase";

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

const userStore = makeStore<User | null>(null);
const cartStore = makeStore<CartItem[]>([]);
const readyStore = makeStore<boolean>(false);

export const subscribeUser = userStore.subscribe;
export const getUserSnapshot = userStore.get;

export const subscribeCart = cartStore.subscribe;
export const getCartSnapshot = cartStore.get;

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

/** Money in Moonbase comes back as { amount, currency } where amount is in
 * minor units (cents). Convert defensively. */
const moneyAmount = (m: unknown): number => {
  if (typeof m === "number") return m;
  if (m && typeof m === "object") {
    const obj = m as Record<string, unknown>;
    const minor = asNumber(obj.amount, NaN);
    if (Number.isFinite(minor)) return minor / 100;
  }
  return 0;
};

/** Pull whichever name field Moonbase happens to expose for a product. */
const productSlug = (p: unknown, fallback = ""): string => {
  if (!p || typeof p !== "object") return fallback;
  const obj = p as Record<string, unknown>;
  return asString(obj.slug ?? obj.id ?? obj.product_id ?? obj.code, fallback);
};

const productName = (p: unknown, fallback = ""): string => {
  if (!p || typeof p !== "object") return fallback;
  const obj = p as Record<string, unknown>;
  return asString(obj.name ?? obj.title ?? obj.label, fallback);
};

const mapMoonbaseCartItem = (item: unknown): CartItem | null => {
  if (!item || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;
  const product = obj.product ?? obj.bundle ?? obj.variation ?? obj;
  const slug = productSlug(product, asString(obj.product_id ?? obj.bundle_id, ""));
  if (!slug) return null;
  return {
    slug,
    name: productName(product, slug),
    price: moneyAmount(obj.unit_price ?? obj.price ?? obj.total),
    license: "perpetual",
    quantity: asNumber(obj.quantity, 1),
  };
};

const mapMoonbaseLicense = (l: unknown, fallbackPlugin: string, orderId: string): License => {
  const obj = (l && typeof l === "object" ? l : {}) as Record<string, unknown>;
  return {
    plugin: productName(obj.product, asString(obj.product_name, fallbackPlugin)),
    version: asString(obj.version, "-"),
    key: asString(obj.key ?? obj.code ?? obj.license_key, ""),
    date: asString(obj.issued_at ?? obj.created_at, new Date().toISOString()),
    orderId,
    downloadUrl: typeof obj.download_url === "string" ? obj.download_url : undefined,
  };
};

const mapMoonbaseOrder = (o: unknown): Order => {
  const obj = (o && typeof o === "object" ? o : {}) as Record<string, unknown>;
  const id = asString(obj.id ?? obj.number ?? obj.reference, "");
  const items = asArray(obj.line_items ?? obj.items).map((line) => {
    const li = (line && typeof line === "object" ? line : {}) as Record<string, unknown>;
    const product = li.product ?? li.bundle ?? li;
    const slug = productSlug(product, "");
    return {
      slug,
      name: productName(product, slug),
      price: moneyAmount(li.unit_price ?? li.price ?? li.total),
      quantity: asNumber(li.quantity, 1),
      license: "perpetual" as const,
    };
  });
  return {
    id,
    date: asString(obj.completed_at ?? obj.created_at, new Date().toISOString()),
    total: moneyAmount(obj.total ?? obj.amount),
    items,
    paymentLast4: asString(
      (obj.payment as Record<string, unknown> | undefined)?.last4 ?? obj.last4,
      "····",
    ),
  };
};

const mapMoonbaseUser = (u: unknown, storefront: unknown): User | null => {
  if (!u || typeof u !== "object") return null;
  const obj = u as Record<string, unknown>;
  const id = asString(obj.id, "");
  if (!id) return null;
  const orders = asArray((obj.orders as unknown) ?? (storefront as Record<string, unknown>)?.orders).map(
    mapMoonbaseOrder,
  );
  const licenses: License[] = [];
  for (const owned of asArray(
    obj.owned_products ?? (storefront as Record<string, unknown>)?.owned_products,
  )) {
    const op = (owned && typeof owned === "object" ? owned : {}) as Record<string, unknown>;
    const productLabel = productName(op.product, productSlug(op.product, "plugin"));
    const orderId = asString(op.order_id, "");
    for (const lic of asArray(op.licenses)) {
      licenses.push(mapMoonbaseLicense(lic, productLabel, orderId));
    }
  }
  return {
    id,
    email: asString(obj.email, ""),
    createdAt: asString(obj.created_at, new Date().toISOString()),
    licenses,
    orders,
  };
};

/** Pull current cart from the storefront payload (Moonbase carries the
 * authoritative cart in storefront.cart.items). */
const mapMoonbaseCart = (storefront: unknown): CartItem[] => {
  if (!storefront || typeof storefront !== "object") return [];
  const obj = storefront as Record<string, unknown>;
  const cart = (obj.cart as Record<string, unknown> | undefined) ?? {};
  const items = asArray(cart.items ?? cart.line_items);
  return items
    .map(mapMoonbaseCartItem)
    .filter((x): x is CartItem => x !== null);
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
    userStore.set(mapMoonbaseUser(event.user, event.storefront));
    cartStore.set(mapMoonbaseCart(event.storefront));
    readyStore.set(true);
  });

  Moonbase.on(MoonbaseEvent.SignedIn, (event: { user: unknown }) => {
    const next = mapMoonbaseUser(event.user, null);
    if (next) userStore.set(next);
  });

  Moonbase.on(MoonbaseEvent.SignedUp, (event: { user: unknown }) => {
    const next = mapMoonbaseUser(event.user, null);
    if (next) userStore.set(next);
  });

  Moonbase.on(MoonbaseEvent.SignedOut, () => {
    userStore.set(null);
    cartStore.set([]);
  });

  Moonbase.on(MoonbaseEvent.CheckoutCompleted, (event: { order: unknown; user?: unknown }) => {
    // The next StorefrontUpdated tick will deliver the authoritative state,
    // but optimistically clear the cart and append the order so the redirect
    // / order-success render isn't empty.
    cartStore.set([]);
    const order = mapMoonbaseOrder(event.order);
    const next = mapMoonbaseUser(event.user, null);
    if (next) {
      userStore.set({ ...next, orders: [order, ...next.orders.filter((o) => o.id !== order.id)] });
    }
  });

  Moonbase.on(MoonbaseEvent.AddedToCart, (event: { item: unknown }) => {
    // Moonbase will fire StorefrontUpdated shortly after; the optimistic local
    // append below keeps the header count snappy on slow networks.
    const mapped = mapMoonbaseCartItem(event.item);
    if (!mapped) return;
    const current = cartStore.get();
    const idx = current.findIndex((c) => c.slug === mapped.slug && c.license === mapped.license);
    if (idx === -1) {
      cartStore.set([...current, mapped]);
    } else {
      const merged = [...current];
      merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + mapped.quantity };
      cartStore.set(merged);
    }
  });
};

/** Helper for use in `useSyncExternalStore` SSR path. We're CSR-only, so
 * return the same as the regular snapshot. */
export const getServerSnapshot = () => null;

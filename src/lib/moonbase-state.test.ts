/**
 * Tests for the Moonbase event mirror.
 *
 * This is the money path: `mapStorefrontPricing` decides the number the product
 * page advertises and `mapMoonbaseCartItem` decides the number the cart shows.
 * A regression here displays one price and charges another, silently. None of
 * the mappers are exported, so the suite drives the real public surface —
 * bindMoonbaseEvents() + emitted MoonbaseEvents + localStorage — which also
 * covers the storage re-hydration path the cart actually depends on.
 *
 * Module state (the `bound` flag and the four stores) is per-module, so every
 * test loads a fresh copy via resetModules + dynamic import.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const MoonbaseEventMock = {
  StorefrontUpdated: "StorefrontUpdated",
  SignedIn: "SignedIn",
  SignedUp: "SignedUp",
  SignedOut: "SignedOut",
  CheckoutCompleted: "CheckoutCompleted",
  CheckoutClosed: "CheckoutClosed",
  AddedToCart: "AddedToCart",
} as const;

type Handler = (event: unknown) => void;
const handlers = new Map<string, Handler[]>();

vi.mock("@/lib/moonbase", () => ({
  Moonbase: {
    on: (event: string, cb: Handler) => {
      const list = handlers.get(event) ?? [];
      list.push(cb);
      handlers.set(event, list);
    },
  },
  MoonbaseEvent: MoonbaseEventMock,
  moonbaseUrl: "https://test.moonbase.sh",
  DISPLAY_CURRENCY: "USD",
}));

const SESSION_KEY = "moonbase_session";

const emit = (event: string, payload: unknown) => {
  for (const cb of handlers.get(event) ?? []) cb(payload);
};

/** Fresh module instance with events bound. Seed localStorage *before* calling
 *  this when a test needs the priming read to see a cart. */
const load = async () => {
  handlers.clear();
  vi.resetModules();
  const mod = await import("./moonbase-state");
  mod.bindMoonbaseEvents();
  return mod;
};

/** A storefront payload shaped like the SDK's: products carry variations whose
 *  `price` is a per-currency record in major units. */
const storefront = (products: unknown[], suggestedCurrency = "USD") => ({
  products,
  suggestedCurrency,
});

beforeEach(() => {
  window.localStorage.clear();
});

describe("pricing projection", () => {
  it("projects USD price and regularPrice from the default variation", async () => {
    const mod = await load();
    emit("StorefrontUpdated", {
      storefront: storefront([
        {
          id: "chaosverb",
          defaultVariation: {
            price: { USD: 36, ILS: 105 },
            originalPrice: { USD: 49, ILS: 149 },
          },
        },
      ]),
    });

    expect(mod.getPricingSnapshot()).toEqual({
      chaosverb: { price: 36, regularPrice: 49 },
    });
  });

  it("prefers USD over the storefront's geo-suggested currency", async () => {
    const mod = await load();
    emit("StorefrontUpdated", {
      storefront: storefront(
        [{ id: "chaosverb", defaultVariation: { price: { ILS: 105, USD: 36 } } }],
        "ILS",
      ),
    });

    // The shopper is geo-suggested ILS, but the site presents USD everywhere.
    expect(mod.getPricingSnapshot().chaosverb.price).toBe(36);
  });

  it("falls back to the first variation when there is no defaultVariation", async () => {
    const mod = await load();
    emit("StorefrontUpdated", {
      storefront: storefront([
        { id: "fiction", variations: [{ price: { USD: 19 } }, { price: { USD: 99 } }] },
      ]),
    });

    expect(mod.getPricingSnapshot().fiction.price).toBe(19);
  });

  it("collapses regularPrice to price when originalPrice is not higher", async () => {
    const mod = await load();
    emit("StorefrontUpdated", {
      storefront: storefront([
        { id: "chaosverb", defaultVariation: { price: { USD: 36 }, originalPrice: { USD: 36 } } },
      ]),
    });

    // No crossed-out price should render when there's no actual discount.
    expect(mod.getPricingSnapshot().chaosverb).toEqual({ price: 36, regularPrice: 36 });
  });

  it("omits products priced at or below zero so the static fallback holds", async () => {
    const mod = await load();
    emit("StorefrontUpdated", {
      storefront: storefront([
        { id: "unpriced", defaultVariation: { price: { USD: 0 } } },
        { id: "novariation" },
        { id: "chaosverb", defaultVariation: { price: { USD: 36 } } },
      ]),
    });

    // usePluginPricing holds data/plugins.ts pricing until a real number lands,
    // which is what prevents a $0 flash on first paint.
    const snapshot = mod.getPricingSnapshot();
    expect(Object.keys(snapshot)).toEqual(["chaosverb"]);
  });

  it("marks the mirror ready once a storefront has arrived", async () => {
    const mod = await load();
    expect(mod.getReadySnapshot()).toBe(false);
    emit("StorefrontUpdated", { storefront: storefront([]) });
    expect(mod.getReadySnapshot()).toBe(true);
  });

  it("survives a malformed storefront payload", async () => {
    const mod = await load();
    expect(() => emit("StorefrontUpdated", { storefront: null })).not.toThrow();
    expect(mod.getPricingSnapshot()).toEqual({});
    expect(mod.getReadySnapshot()).toBe(true);
  });
});

describe("cart projection", () => {
  const seed = (session: unknown) =>
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  it("hydrates enriched line items from the persisted session", async () => {
    seed({
      currency: "USD",
      items: [
        {
          quantity: 2,
          price: { USD: 36 },
          product: { slug: "chaosverb", name: "Chaosverb" },
        },
      ],
    });
    const mod = await load();

    expect(mod.getCartSnapshot()).toEqual([
      { slug: "chaosverb", name: "Chaosverb", price: 36, license: "perpetual", quantity: 2 },
    ]);
  });

  it("falls back to the variation price when the line has none", async () => {
    seed({
      currency: "USD",
      items: [{ quantity: 1, product: { slug: "fiction" }, variation: { price: { USD: 19 } } }],
    });
    const mod = await load();

    expect(mod.getCartSnapshot()[0].price).toBe(19);
  });

  it("derives a unit price from total.subtotal when nothing else is priced", async () => {
    seed({
      currency: "USD",
      items: [
        { quantity: 3, product: { slug: "chaosverb" }, total: { subtotal: { USD: 108 } } },
      ],
    });
    const mod = await load();

    // subtotal is the line total, so the unit price must be divided out.
    expect(mod.getCartSnapshot()[0].price).toBe(36);
  });

  it("uses the order's own currency when USD is absent rather than zeroing the line", async () => {
    seed({
      currency: "ILS",
      items: [{ quantity: 1, product: { slug: "chaosverb" }, price: { ILS: 105 } }],
    });
    const mod = await load();

    expect(mod.getCartSnapshot()[0].price).toBe(105);
  });

  it("falls back to productId when the line carries no enriched product", async () => {
    seed({ currency: "USD", items: [{ quantity: 1, productId: "chaosverb", price: { USD: 36 } }] });
    const mod = await load();

    const [line] = mod.getCartSnapshot();
    expect(line.slug).toBe("chaosverb");
    // No product object means no name — the slug stands in.
    expect(line.name).toBe("chaosverb");
  });

  it("drops line items with no resolvable slug", async () => {
    seed({
      currency: "USD",
      items: [{ quantity: 1, price: { USD: 36 } }, null, "nonsense"],
    });
    const mod = await load();

    expect(mod.getCartSnapshot()).toEqual([]);
  });

  it("returns an empty cart when the session is unparseable", async () => {
    window.localStorage.setItem(SESSION_KEY, "{ not json");
    const mod = await load();

    expect(mod.getCartSnapshot()).toEqual([]);
  });

  it("refreshes on AddedToCart", async () => {
    const mod = await load();
    expect(mod.getCartSnapshot()).toEqual([]);

    seed({ currency: "USD", items: [{ quantity: 1, product: { slug: "chaosverb" }, price: { USD: 36 } }] });
    emit("AddedToCart", { item: {}, currency: "USD" });

    expect(mod.getCartSnapshot()).toHaveLength(1);
  });

  it("mirrors cart changes made in another tab", async () => {
    const mod = await load();

    seed({ currency: "USD", items: [{ quantity: 1, product: { slug: "fiction" }, price: { USD: 19 } }] });
    window.dispatchEvent(new StorageEvent("storage", { key: SESSION_KEY }));

    expect(mod.getCartSnapshot()).toHaveLength(1);
  });

  it("ignores storage events for unrelated keys", async () => {
    const mod = await load();

    seed({ currency: "USD", items: [{ quantity: 1, product: { slug: "fiction" }, price: { USD: 19 } }] });
    window.dispatchEvent(new StorageEvent("storage", { key: "something_else" }));

    expect(mod.getCartSnapshot()).toEqual([]);
  });

  it("keeps snapshot identity stable when nothing changed", async () => {
    seed({ currency: "USD", items: [{ quantity: 1, product: { slug: "chaosverb" }, price: { USD: 36 } }] });
    const mod = await load();

    const before = mod.getCartSnapshot();
    emit("AddedToCart", { item: {}, currency: "USD" });

    // useSyncExternalStore re-renders on identity change; re-reading identical
    // storage must not churn React.
    expect(mod.getCartSnapshot()).toBe(before);
  });
});

describe("session lifecycle", () => {
  it("projects a signed-in user with empty licences and orders", async () => {
    const mod = await load();
    emit("SignedIn", { user: { id: "u_1", email: "a@b.com", createdAt: "2026-01-01" } });

    // The embedded SDK doesn't surface licences/orders — Account.tsx delegates
    // to Moonbase.view_account() instead, so these stay empty by design.
    expect(mod.getUserSnapshot()).toEqual({
      id: "u_1",
      email: "a@b.com",
      createdAt: "2026-01-01",
      licenses: [],
      orders: [],
    });
  });

  it("ignores a user payload with no id", async () => {
    const mod = await load();
    emit("SignedIn", { user: { email: "a@b.com" } });
    expect(mod.getUserSnapshot()).toBeNull();
  });

  it("clears user and cart on sign-out", async () => {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ currency: "USD", items: [{ quantity: 1, product: { slug: "chaosverb" }, price: { USD: 36 } }] }),
    );
    const mod = await load();
    emit("SignedIn", { user: { id: "u_1", email: "a@b.com" } });
    expect(mod.getCartSnapshot()).toHaveLength(1);

    emit("SignedOut", {});

    expect(mod.getUserSnapshot()).toBeNull();
    expect(mod.getCartSnapshot()).toEqual([]);
  });

  it("clears the cart optimistically on checkout completion", async () => {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ currency: "USD", items: [{ quantity: 1, product: { slug: "chaosverb" }, price: { USD: 36 } }] }),
    );
    const mod = await load();
    expect(mod.getCartSnapshot()).toHaveLength(1);

    emit("CheckoutCompleted", { order: { id: "o_1" }, user: { id: "u_1", email: "a@b.com" } });

    // The order-success redirect must not render a stale cart badge.
    expect(mod.getCartSnapshot()).toEqual([]);
    expect(mod.getUserSnapshot()?.id).toBe("u_1");
  });

  it("notifies subscribers when the cart changes", async () => {
    const mod = await load();
    const seen: number[] = [];
    mod.subscribeCart(() => seen.push(mod.getCartSnapshot().length));

    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ currency: "USD", items: [{ quantity: 1, product: { slug: "chaosverb" }, price: { USD: 36 } }] }),
    );
    emit("AddedToCart", { item: {}, currency: "USD" });

    expect(seen).toEqual([1]);
  });
});

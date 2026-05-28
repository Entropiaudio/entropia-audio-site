// Dual-mode cart provider.
//
// When VITE_MOONBASE_URL is set, items are sourced from the Moonbase event
// mirror (see lib/moonbase-state.ts) and mutations fire Moonbase intents.
// When unset, the original localStorage prototype runs unchanged so dev
// without an account keeps working. Consumers call `useCart()` either way,
// the surface is the same.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { safeGet, safeSet } from "@/lib/storage";
import { isMoonbaseEnabled, Moonbase } from "@/lib/moonbase";
import { getCartSnapshot, subscribeCart } from "@/lib/moonbase-state";
import { useAuth } from "./AuthContext";

/** Narrowed to perpetual, the only Moonbase license model the storefront ships. */
export type CartLicense = "perpetual";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  license: CartLicense;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (slug: string, license: CartLicense) => void;
  setQuantity: (slug: string, license: CartLicense, quantity: number) => void;
  clear: () => void;
};

/** Cart storage is partitioned per-user so a shared browser can't leak one
 * account's cart into another's. Guests get their own partition so the
 * "browse → fill cart → sign up" flow still works (the guest cart is
 * adopted at sign-up by the local prototype). */
const GUEST_CART_KEY = "entropia.cart.v1.guest";
const cartKeyFor = (userId: string | null) =>
  userId ? `entropia.cart.v1.user.${userId}` : GUEST_CART_KEY;
const MAX_QUANTITY = 99;

const CartContext = createContext<CartState | null>(null);

const sameLine = (a: { slug: string; license: CartLicense }, b: { slug: string; license: CartLicense }) =>
  a.slug === b.slug && a.license === b.license;

const clampQty = (n: number) => {
  if (!Number.isFinite(n)) return 0;
  const i = Math.floor(n);
  if (i <= 0) return 0;
  return Math.min(i, MAX_QUANTITY);
};

/* ------------------------------------------------------------------ */
/* Moonbase-backed provider, Path B: site UI, Moonbase backend.       */
/* ------------------------------------------------------------------ */

const MoonbaseCartProvider = ({ children }: { children: ReactNode }) => {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot);

  const add: CartState["add"] = useCallback((item, quantity = 1) => {
    const q = clampQty(quantity);
    if (q === 0) return;
    void Moonbase.add_to_cart({
      product_id: item.slug,
      quantity: q,
      show_cart: false,
    });
  }, []);

  // Moonbase doesn't expose direct quantity / remove primitives on the
  // public SDK, those mutations live inside the cart drawer. Opening
  // view_cart() lets the customer adjust there; we keep the seam so the
  // site's cart buttons still work without dropping clicks on the floor.
  const remove: CartState["remove"] = useCallback(() => {
    Moonbase.view_cart();
  }, []);

  const setQuantity: CartState["setQuantity"] = useCallback(() => {
    Moonbase.view_cart();
  }, []);

  // Same reasoning, Moonbase doesn't expose a programmatic clear. View
  // the cart and let the customer empty it from the drawer.
  const clear = useCallback(() => {
    Moonbase.view_cart();
  }, []);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    return { items, count, subtotal, add, remove, setQuantity, clear };
  }, [items, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ------------------------------------------------------------------ */
/* Local prototype, kept for dev without a Moonbase account.          */
/* ------------------------------------------------------------------ */

const LocalCartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const currentKey = cartKeyFor(user?.id ?? null);

  const [items, setItems] = useState<CartItem[]>(() => safeGet<CartItem[]>(currentKey, []));
  const initialMount = useRef(true);
  const prevUserIdRef = useRef<string | null>(user?.id ?? null);

  // Persist the current view to *this user's* partition. A switch swaps the
  // key under us, so the effect re-runs and writes to the new partition.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    safeSet(currentKey, items);
  }, [items, currentKey]);

  // Cross-tab sync, only mirror changes to *our* key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== currentKey) return;
      try {
        const next = e.newValue ? (JSON.parse(e.newValue) as CartItem[]) : [];
        initialMount.current = true;
        setItems(Array.isArray(next) ? next : []);
      } catch {
        /* ignore parse errors */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [currentKey]);

  // On user transition, load the partition that belongs to the new identity.
  // The guest → signed-in case still adopts the guest cart (so "browse, fill,
  // sign up, check out" flows uninterrupted), but only when the new user's
  // partition is empty, never overwrite an existing per-user cart.
  useEffect(() => {
    const currentId = user?.id ?? null;
    const prevId = prevUserIdRef.current;
    if (prevId === currentId) return;

    const stored = safeGet<CartItem[]>(currentKey, []);
    if (prevId === null && currentId !== null && stored.length === 0 && items.length > 0) {
      // Guest → signed-in with empty signed-in cart: carry the guest cart over.
      safeSet(currentKey, items);
      safeSet(GUEST_CART_KEY, []);
    } else {
      // Signed-out, or switched user, or signed-in with existing cart, load
      // whatever is persisted for this partition (never leak the previous
      // identity's items).
      initialMount.current = true;
      setItems(stored);
    }
    prevUserIdRef.current = currentId;
    // intentionally omit `items` from deps, we only want to act on identity
    // changes, not on cart mutations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentKey]);

  const add: CartState["add"] = useCallback((item, quantity = 1) => {
    const q = clampQty(quantity);
    if (q === 0) return;
    setItems((prev) => {
      const idx = prev.findIndex((p) => sameLine(p, item));
      if (idx === -1) return [...prev, { ...item, quantity: q }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: clampQty(next[idx].quantity + q) };
      return next;
    });
  }, []);

  const remove: CartState["remove"] = useCallback((slug, license) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, { slug, license })));
  }, []);

  const setQuantity: CartState["setQuantity"] = useCallback((slug, license, quantity) => {
    const q = clampQty(quantity);
    setItems((prev) => {
      if (q === 0) return prev.filter((p) => !sameLine(p, { slug, license }));
      return prev.map((p) => (sameLine(p, { slug, license }) ? { ...p, quantity: q } : p));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    return { items, count, subtotal, add, remove, setQuantity, clear };
  }, [items, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const CartProvider = ({ children }: { children: ReactNode }) =>
  isMoonbaseEnabled ? (
    <MoonbaseCartProvider>{children}</MoonbaseCartProvider>
  ) : (
    <LocalCartProvider>{children}</LocalCartProvider>
  );

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

// MOONBASE INTEGRATION SEAM — Moonbase owns the cart once enabled. Keep the
// CartItem / CartState shape exported here so call sites don't churn; the new
// provider should source items from Moonbase's session and route mutations
// (add / remove / setQuantity / clear) through the SDK. Checkout itself moves
// to Moonbase's flow, so `clear()` will mostly be triggered by a Moonbase
// success webhook / event rather than by Checkout.tsx as it is today.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet } from "@/lib/storage";
import { useAuth } from "./AuthContext";

export type CartLicense = "perpetual" | "rent-to-own";

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

const STORAGE_KEY = "entropia.cart.v1";
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => safeGet<CartItem[]>(STORAGE_KEY, []));
  const initialMount = useRef(true);
  const { user } = useAuth();
  const prevUserIdRef = useRef<string | null>(user?.id ?? null);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    safeSet(STORAGE_KEY, items);
  }, [items]);

  // Cross-tab sync — when another tab mutates the cart, mirror it here.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
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
  }, []);

  // Drop the cart when the signed-in user identity changes — sign-out or a
  // different user signing in on a shared device. A guest → signed-in
  // transition keeps the cart, so visitors can fill the cart then create an
  // account at checkout.
  useEffect(() => {
    const currentId = user?.id ?? null;
    const prevId = prevUserIdRef.current;
    if (prevId !== currentId && prevId !== null) {
      setItems([]);
    }
    prevUserIdRef.current = currentId;
  }, [user]);

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

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

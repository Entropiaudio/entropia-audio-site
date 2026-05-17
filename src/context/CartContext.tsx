// MOONBASE INTEGRATION SEAM — Moonbase owns the cart once enabled. Keep the
// CartItem / CartState shape exported here so call sites don't churn; the new
// provider should source items from Moonbase's session and route mutations
// (add / remove / setQuantity / clear) through the SDK. Checkout itself moves
// to Moonbase's flow, so `clear()` will mostly be triggered by a Moonbase
// success webhook / event rather than by Checkout.tsx as it is today.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { safeGet, safeSet } from "@/lib/storage";

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

const CartContext = createContext<CartState | null>(null);

const sameLine = (a: { slug: string; license: CartLicense }, b: { slug: string; license: CartLicense }) =>
  a.slug === b.slug && a.license === b.license;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => safeGet<CartItem[]>(STORAGE_KEY, []));

  useEffect(() => {
    safeSet(STORAGE_KEY, items);
  }, [items]);

  const add: CartState["add"] = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => sameLine(p, item));
      if (idx === -1) return [...prev, { ...item, quantity }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      return next;
    });
  }, []);

  const remove: CartState["remove"] = useCallback((slug, license) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, { slug, license })));
  }, []);

  const setQuantity: CartState["setQuantity"] = useCallback((slug, license, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => !sameLine(p, { slug, license }));
      return prev.map((p) => (sameLine(p, { slug, license }) ? { ...p, quantity } : p));
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

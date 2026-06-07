// Cart provider, backed by the Moonbase embedded storefront.
//
// Items are sourced from the Moonbase event mirror (lib/moonbase-state.ts) and
// mutations fire Moonbase intents. Moonbase is the only backend — the former
// localStorage prototype cart was removed.
import { createContext, ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { Moonbase } from "@/lib/moonbase";
import { getCartSnapshot, subscribeCart } from "@/lib/moonbase-state";

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

const MAX_QUANTITY = 99;

const clampQty = (n: number) => {
  if (!Number.isFinite(n)) return 0;
  const i = Math.floor(n);
  if (i <= 0) return 0;
  return Math.min(i, MAX_QUANTITY);
};

const CartContext = createContext<CartState | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
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

  // Moonbase doesn't expose direct quantity / remove / clear primitives on the
  // public SDK — those mutations live inside the cart drawer. Opening
  // view_cart() lets the customer adjust there; we keep the seam so the site's
  // cart buttons still work without dropping clicks on the floor.
  const remove: CartState["remove"] = useCallback(() => {
    Moonbase.view_cart();
  }, []);

  const setQuantity: CartState["setQuantity"] = useCallback(() => {
    Moonbase.view_cart();
  }, []);

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

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

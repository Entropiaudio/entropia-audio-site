// Auth provider, backed by the Moonbase embedded storefront.
//
// User / licenses / orders come from the Moonbase event mirror
// (lib/moonbase-state.ts); sign-in / sign-up / sign-out / account-management
// actions fire Moonbase modal intents. Moonbase is the only backend — the
// former localStorage prototype (djb2 password store, mock provider) was
// removed.
import { createContext, ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { Moonbase } from "@/lib/moonbase";
import { getUserSnapshot, subscribeUser } from "@/lib/moonbase-state";

export type License = {
  plugin: string;
  version: string;
  key: string;
  date: string;
  orderId: string;
  /** Optional installer URL. Empty until installers ship. */
  downloadUrl?: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  items: { slug: string; name: string; price: number; quantity: number; license: string }[];
  paymentLast4: string;
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
  licenses: License[];
  orders: Order[];
};

export type AuthResult = { ok: true } | { ok: false; error: string };

type AuthState = {
  user: User | null;
  isAuthed: boolean;
  /** The Moonbase modal owns credentials. `email` is forwarded as a prefill so
   *  the user doesn't retype it. */
  signIn: (email: string, password?: string) => Promise<User | void>;
  signUp: (email: string, password?: string) => Promise<User | void>;
  signOut: () => void;
  updateEmail: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  attachOrder: (order: Order, licenses: License[]) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useSyncExternalStore(subscribeUser, getUserSnapshot);

  const signIn = useCallback(async (email: string) => {
    Moonbase.sign_in(email ? { email } : undefined);
    // Resolution comes back via MoonbaseEvent.SignedIn → moonbase-state updates
    // the store → consumers re-render. We can't return the User synchronously
    // here; callers should react to `user` instead.
  }, []);

  const signUp = useCallback(async (email: string) => {
    Moonbase.sign_up(email ? { email } : undefined);
  }, []);

  const signOut = useCallback(() => {
    // The SDK doesn't expose a programmatic sign-out intent. Sending the
    // customer into their account view gives them the sign-out control, and we
    // get the SignedOut event back on confirmation.
    Moonbase.view_account();
  }, []);

  // Email / password edits live inside the Moonbase account modal; opening it is
  // the closest analogue to the site's old inline form.
  const updateEmail = useCallback(async (): Promise<AuthResult> => {
    Moonbase.view_account();
    return { ok: true };
  }, []);

  const updatePassword = useCallback(async (): Promise<AuthResult> => {
    Moonbase.view_account();
    return { ok: true };
  }, []);

  // No-op: Moonbase issues licenses + orders, the StorefrontUpdated event
  // delivers them.
  const attachOrder = useCallback(() => {
    /* intentional no-op */
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthed: !!user,
      signIn,
      signUp,
      signOut,
      updateEmail,
      updatePassword,
      attachOrder,
    }),
    [user, signIn, signUp, signOut, updateEmail, updatePassword, attachOrder],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

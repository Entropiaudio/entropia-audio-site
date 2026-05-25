// MOONBASE INTEGRATION SEAM — replace this whole module when wiring the real
// account. Moonbase's embedded storefront owns auth (sign-in / sign-up /
// password / session); keep the User / AuthResult / AuthState shapes exported
// here as the consumer-facing types and have the new implementation map
// Moonbase's session object onto them. Consumers touch `useAuth()` only, so
// swapping the provider is the single change point. Until VITE_MOONBASE_URL is
// set, the localStorage prototype below stays in play.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet } from "@/lib/storage";
import { isMoonbaseEnabled } from "@/lib/moonbase";

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
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => void;
  updateEmail: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  attachOrder: (order: Order, licenses: License[]) => void;
};

const USER_KEY = "entropia.user.v1";
const DB_KEY = "entropia.users.v1";

type DbRecord = { user: User; passwordHash: string };
type Db = Record<string, DbRecord>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_PASSWORD_LEN = 6;
const normalizeEmail = (e: string) => e.trim().toLowerCase();

// djb2-xor — collision-prone, NOT cryptographically secure. Acceptable only
// because this whole module is a localStorage prototype that gets replaced by
// Moonbase before real customer data lives here. See guard below.
const hash = (s: string) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
};

const loadDb = () => safeGet<Db>(DB_KEY, {});
const saveDb = (db: Db) => safeSet(DB_KEY, db);

if (typeof window !== "undefined" && import.meta.env.PROD && !isMoonbaseEnabled) {
  // Loud, console-only — the prototype DB is fine for staging but should never
  // hold real customer data. Set VITE_MOONBASE_URL before going live.
  console.warn(
    "[entropia auth] Moonbase is not configured (VITE_MOONBASE_URL unset). " +
      "Falling back to the localStorage prototype — do not collect real customer credentials.",
  );
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => safeGet<User | null>(USER_KEY, null));
  // Skip the initial persistence write (we already loaded from this key).
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    safeSet(USER_KEY, user);
  }, [user]);

  // Cross-tab session sync — sign-out / sign-in in another tab propagates here.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== USER_KEY) return;
      try {
        const next = e.newValue ? (JSON.parse(e.newValue) as User | null) : null;
        // Block the next write-back so the storage event doesn't bounce.
        initialMount.current = true;
        setUser(next);
      } catch {
        /* ignore parse errors */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const key = normalizeEmail(email);
    if (!EMAIL_RE.test(key)) throw new Error("please enter a valid email.");
    const db = loadDb();
    const record = db[key];
    if (!record) throw new Error("no account found for that email.");
    if (record.passwordHash !== hash(password)) throw new Error("incorrect password.");
    setUser(record.user);
    return record.user;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const key = normalizeEmail(email);
    if (!EMAIL_RE.test(key)) throw new Error("please enter a valid email.");
    if (password.length < MIN_PASSWORD_LEN) {
      throw new Error(`password must be at least ${MIN_PASSWORD_LEN} characters.`);
    }
    const db = loadDb();
    if (db[key]) throw new Error("account already exists for that email.");
    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      email: key,
      createdAt: new Date().toISOString(),
      licenses: [],
      orders: [],
    };
    db[key] = { user: newUser, passwordHash: hash(password) };
    saveDb(db);
    setUser(newUser);
    return newUser;
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const updateEmail = useCallback(async (email: string): Promise<AuthResult> => {
    const newKey = normalizeEmail(email);
    if (!EMAIL_RE.test(newKey)) return { ok: false, error: "please enter a valid email." };

    let result: AuthResult = { ok: true };
    setUser((prev) => {
      if (!prev) {
        result = { ok: false, error: "not signed in." };
        return prev;
      }
      const oldKey = prev.email;
      if (newKey === oldKey) {
        // No-op rather than churning the DB.
        return prev;
      }
      const db = loadDb();
      if (db[newKey]) {
        // Collision: would clobber another account. Refuse.
        result = { ok: false, error: "that email is already in use." };
        return prev;
      }
      const rec = db[oldKey];
      if (!rec) {
        result = { ok: false, error: "your account record is missing. please sign in again." };
        return prev;
      }
      delete db[oldKey];
      const next = { ...prev, email: newKey };
      db[newKey] = { ...rec, user: next };
      saveDb(db);
      return next;
    });
    return result;
  }, []);

  const updatePassword = useCallback(
    async (password: string): Promise<AuthResult> => {
      if (password.length < MIN_PASSWORD_LEN) {
        return { ok: false, error: `password must be at least ${MIN_PASSWORD_LEN} characters.` };
      }
      if (!user) return { ok: false, error: "not signed in." };
      const db = loadDb();
      const rec = db[user.email];
      if (!rec) return { ok: false, error: "your account record is missing. please sign in again." };
      db[user.email] = { ...rec, passwordHash: hash(password) };
      saveDb(db);
      return { ok: true };
    },
    [user],
  );

  const attachOrder = useCallback((order: Order, licenses: License[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next: User = {
        ...prev,
        orders: [order, ...prev.orders],
        licenses: [...licenses, ...prev.licenses],
      };
      const db = loadDb();
      const rec = db[prev.email];
      if (rec) {
        db[prev.email] = { ...rec, user: next };
        saveDb(db);
      } else if (typeof window !== "undefined") {
        // Orphaned session — the DB was wiped while this tab was signed in.
        // Keep the order in the live user state so the checkout receipt still
        // renders, but warn loudly: it won't survive sign-out.
        console.warn(
          "[entropia auth] attachOrder: no DB record for current session; order kept in memory only.",
        );
      }
      return next;
    });
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

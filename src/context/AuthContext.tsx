import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { safeGet, safeSet } from "@/lib/storage";

export type License = {
  plugin: string;
  version: string;
  key: string;
  date: string;
  orderId: string;
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

type AuthState = {
  user: User | null;
  isAuthed: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
  attachOrder: (order: Order, licenses: License[]) => void;
};

const USER_KEY = "entropia.user.v1";
const DB_KEY = "entropia.users.v1";

type DbRecord = { user: User; passwordHash: string };
type Db = Record<string, DbRecord>;

const hash = (s: string) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
};

const loadDb = () => safeGet<Db>(DB_KEY, {});
const saveDb = (db: Db) => safeSet(DB_KEY, db);

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => safeGet<User | null>(USER_KEY, null));

  useEffect(() => {
    safeSet(USER_KEY, user);
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    const db = loadDb();
    const record = db[email.toLowerCase()];
    if (!record) throw new Error("no account found for that email.");
    if (record.passwordHash !== hash(password)) throw new Error("incorrect password.");
    setUser(record.user);
    return record.user;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const db = loadDb();
    const key = email.toLowerCase();
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

  const persist = (next: User) => {
    const db = loadDb();
    const rec = db[next.email];
    if (rec) {
      db[next.email] = { ...rec, user: next };
      saveDb(db);
    }
    setUser(next);
  };

  const updateEmail = useCallback((email: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const db = loadDb();
      const oldKey = prev.email;
      const newKey = email.toLowerCase();
      const rec = db[oldKey];
      if (!rec) return prev;
      delete db[oldKey];
      const next = { ...prev, email: newKey };
      db[newKey] = { ...rec, user: next };
      saveDb(db);
      return next;
    });
  }, []);

  const updatePassword = useCallback((password: string) => {
    if (!user) return;
    const db = loadDb();
    const rec = db[user.email];
    if (!rec) return;
    db[user.email] = { ...rec, passwordHash: hash(password) };
    saveDb(db);
  }, [user]);

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

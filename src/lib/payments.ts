import type { CartItem } from "@/context/CartContext";
import type { License, Order } from "@/context/AuthContext";

export type PaymentDetails = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  email: string;
  country: string;
  postal: string;
};

export type PaymentResult =
  | { ok: true; order: Order; licenses: License[] }
  | { ok: false; error: string };

export interface PaymentProvider {
  name: string;
  charge: (input: { amount: number; items: CartItem[]; payment: PaymentDetails }) => Promise<PaymentResult>;
}

const onlyDigits = (s: string) => s.replace(/\D+/g, "");

const luhn = (num: string) => {
  const digits = onlyDigits(num);
  if (digits.length < 12) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const validExpiry = (e: string) => {
  const m = e.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp >= now;
};

export const validatePayment = (p: PaymentDetails): string | null => {
  if (!p.name.trim()) return "name on card is required.";
  if (!luhn(p.cardNumber)) return "card number looks invalid.";
  if (!validExpiry(p.expiry)) return "expiry must be MM/YY and not in the past.";
  if (!/^\d{3,4}$/.test(p.cvc)) return "cvc must be 3 or 4 digits.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return "email looks invalid.";
  if (!p.country.trim()) return "country is required.";
  if (!p.postal.trim()) return "postal code is required.";
  return null;
};

const issueLicenses = (orderId: string, items: CartItem[]): License[] => {
  const today = new Date().toISOString().slice(0, 10);
  return items.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      plugin: item.slug,
      version: "1.0.0",
      key: generateLicenseKey(item.slug),
      date: today,
      orderId,
    })),
  );
};

const LICENSE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Crypto-grade random bytes. The 32-char alphabet divides 256 evenly (8 × 32),
 *  so `b % 32` is unbiased. */
const cryptoRandomBlock = (length: number) => {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < length; i++) out += LICENSE_CHARS[buf[i] % LICENSE_CHARS.length];
  return out;
};

const generateLicenseKey = (slug: string) => {
  const prefix = slug.slice(0, 3).toUpperCase();
  return `${prefix}1-${cryptoRandomBlock(4)}-${cryptoRandomBlock(4)}-${cryptoRandomBlock(4)}-${cryptoRandomBlock(4)}`;
};

const generateOrderId = () => {
  // Timestamp prefix keeps IDs roughly sortable; random suffix avoids
  // same-millisecond collisions when checkout fires in parallel.
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  const rand = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
  return `ord_${Date.now().toString(36)}_${rand}`;
};

export const mockProvider: PaymentProvider = {
  name: "mock",
  charge: async ({ amount, items, payment }) => {
    await new Promise((r) => setTimeout(r, 900));
    const last4 = onlyDigits(payment.cardNumber).slice(-4);
    if (last4 === "0002") return { ok: false, error: "card declined." };
    if (last4 === "0069") return { ok: false, error: "insufficient funds." };

    const orderId = generateOrderId();
    const order: Order = {
      id: orderId,
      date: new Date().toISOString(),
      total: amount,
      paymentLast4: last4,
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        license: i.license,
      })),
    };
    return { ok: true, order, licenses: issueLicenses(orderId, items) };
  },
};

/**
 * Stripe-ready stub. Replace `charge` with a fetch to your /api/checkout
 * endpoint that creates a PaymentIntent server-side and confirms it via
 * @stripe/stripe-js. Kept here so swapping providers is a one-line change.
 */
export const stripeProvider: PaymentProvider = {
  name: "stripe",
  charge: async () => ({ ok: false, error: "stripe provider not configured." }),
};

export const activeProvider: PaymentProvider = mockProvider;

export const formatCard = (raw: string) =>
  onlyDigits(raw).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

export const formatExpiry = (raw: string) => {
  const d = onlyDigits(raw).slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

// MOONBASE INTEGRATION SEAM — once VITE_MOONBASE_URL is set and Moonbase
// exposes a list-subscription endpoint, route through it from inside
// subscribeToNewsletter(). Until then the function queues subscribers in
// localStorage so dev environments don't silently drop signups; the queue is
// a developer affordance, not a real list, and never shipped to end-users.
import { isMoonbaseEnabled } from "./moonbase";
import { safeGet, safeSet } from "./storage";

const QUEUE_KEY = "entropia.newsletter-queue.v1";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type NewsletterResult =
  | { ok: true; queued: boolean; pending: boolean }
  | { ok: false; error: string };

type QueueEntry = { email: string; at: string };

export const subscribeToNewsletter = async (rawEmail: string): Promise<NewsletterResult> => {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "please enter a valid email." };

  if (isMoonbaseEnabled) {
    // TODO: once Moonbase exposes a list-subscription endpoint, call it here
    // and `return { ok: true, queued: false, pending: false }` on success.
    // Falling through to the local queue in the meantime so signups aren't
    // silently dropped while the SDK is being wired up.
  }

  const queue = safeGet<QueueEntry[]>(QUEUE_KEY, []);
  const exists = queue.some((q) => q.email === email);
  if (!exists) {
    queue.push({ email, at: new Date().toISOString() });
    safeSet(QUEUE_KEY, queue);
  }
  return { ok: true, queued: !exists, pending: true };
};

/** Dev-only — inspect the local queue (e.g., from the console). */
export const getNewsletterQueue = () => safeGet<QueueEntry[]>(QUEUE_KEY, []);

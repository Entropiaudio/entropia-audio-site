// Newsletter subscription. Delivery is delegated to Moonbase / the ESP; this
// module only validates the address and reports a pending result. No subscriber
// PII is persisted client-side.
//
// SECURITY: before a real subscription endpoint is wired up, anti-bot /
// rate-limiting MUST be enforced SERVER-SIDE (Moonbase, a Netlify Function, or
// Cloudflare Turnstile). Any client-side check is trivially bypassed and cannot
// be the control.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type NewsletterResult =
  | { ok: true; queued: boolean; pending: boolean }
  | { ok: false; error: string };

export const subscribeToNewsletter = async (rawEmail: string): Promise<NewsletterResult> => {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "please enter a valid email." };

  // TODO(server): POST `email` to the Moonbase list-subscription endpoint once
  // it exists and return its result. Until then, accept optimistically without
  // persisting anything client-side.
  return { ok: true, queued: true, pending: true };
};

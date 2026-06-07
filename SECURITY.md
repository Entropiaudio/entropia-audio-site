# Security posture — entropia audio website

This document describes the security model of the entropia audio storefront, the
controls in place, residual risks, and the compliance picture. It is the
reference for anyone deploying or auditing the site.

## Architecture & trust model

The site is a **static Vite/React single-page app** hosted on Netlify. We run
**no backend of our own**. Everything that touches sensitive data — accounts,
sign-in, the cart, checkout, and **all card payments** — is delegated to the
**Moonbase embedded storefront** (`@moonbase.sh/storefront`, configured via
`VITE_MOONBASE_URL`).

Consequences of that model:

- **Card data never reaches our code or our servers.** Moonbase (and its
  payment processor) own the card fields, tokenisation, and the charge. This
  keeps us in the smallest possible PCI scope (see Compliance).
- The main server-side controls available to a static site are **HTTP response
  headers + a Content-Security-Policy**, both now configured in
  [`public/_headers`](public/_headers).
- **Moonbase is the only backend.** The former localStorage prototype
  (auth/cart/checkout — mock payment processor, non-cryptographic password
  store) has been **removed entirely** from the codebase, so there is no longer
  any insecure-but-unreachable path in the bundle. `VITE_MOONBASE_URL` is now
  required in every environment; a build-time guard (below) hard-fails a
  production build without it.

## Controls in place

### 1. HTTP security headers + CSP — `public/_headers`
Netlify serves these on every response. Highlights:

| Header | Purpose |
| --- | --- |
| `Content-Security-Policy` | Strict injection defenses: `script-src 'self'` (no inline/eval), `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action` locked. Resource directives explicitly allow the self-hosted bundle, Google Fonts, Moonbase, and the payment-provider iframes. |
| `Strict-Transport-Security` | Forces HTTPS for 2 years incl. subdomains (no `preload` by default — opt in below). |
| `X-Frame-Options: DENY` | Anti-clickjacking (legacy companion to `frame-ancestors`). |
| `X-Content-Type-Options: nosniff` | Blocks MIME sniffing. |
| `Referrer-Policy` | `strict-origin-when-cross-origin`. |
| `Permissions-Policy` | Disables camera/mic/geolocation/USB/sensors and FLoC; **leaves `payment` enabled** for self + Moonbase so wallet checkout works. |
| `Cross-Origin-Opener-Policy: same-origin` | Process isolation against cross-window attacks. |
| `Cache-Control` | Fingerprinted `/assets/*` cached immutably; `index.html` always revalidated. |

> **Post-deploy check:** the embedded Moonbase checkout may load a
> payment-provider iframe. After the next deploy, run a real checkout once and
> watch DevTools → Console. If a CSP violation blocks a frame/script/connect
> origin, add that exact origin to the matching directive in `_headers`. Stripe
> and Paddle origins are already pre-allowed.

### 2. Storefront-integrity build guard — `vite.config.ts`
A **production build fails** if `VITE_MOONBASE_URL` is unset. Moonbase is the
only backend, so without it the storefront is non-functional; failing the build
prevents shipping a broken/insecure deploy. `npm run build:dev` (development
mode) is exempt for offline work.

### 3. Open-redirect surface eliminated
- `react-router-dom` bumped to **6.30.4**, patching advisory
  [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42)
  (protocol-relative open redirect).
- The `?next=` redirect parameter (whose naive `safeNext` guard the red-team
  pass bypassed with `/\evil.com`) lived **only in the removed localStorage
  prototype**. Deleting the prototype removed the redirect surface entirely —
  there is no user-controlled navigation target left to validate, which is a
  stronger outcome than patching the guard.

### 4. Vulnerability disclosure — `public/.well-known/security.txt`
RFC 9116 contact + policy so researchers have a clear reporting path.

### 5. Privacy disclosures — `src/copy.ts`
The `/legal/privacy` page now names Moonbase as the data processor, states that
card data never touches our servers, and gives a working contact
(`contact@entropiaudio.com`) with a 30-day response commitment for data-subject
access/erasure requests.

## Red-team testing (attacks simulated against the running app)

Authorized testing of our own site, run against the live dev build. Each attack
class was actually executed, the result observed, and a defense added where the
attack landed.

| Attack | Method | Result | Action |
| --- | --- | --- | --- |
| **Open redirect** | Fired the OWASP bypass payload set at the `?next=` control (`//evil.com`, `/\evil.com`, `/\/evil.com`, scheme, userinfo). | **Landed** on the original guard: `startsWith("//")` let `/\evil.com` through (browsers normalize `\`→`/` → `https://evil.com`). The `?next=` flow existed only in the localStorage prototype. | **Surface eliminated.** First hardened with a URL-parser control + tests; then, when the prototype was removed entirely, the `?next=` flow (and its now-orphaned guard) was deleted — no user-controlled redirect target remains. |
| **Reflected / DOM XSS** | Injected `<img onerror>` / `<svg onload>` into `/`, `/plugins/:slug`, `?next=`, `/order/:id`. | **Did not land.** React escapes all rendered text; payloads appeared as inert text, no nodes created, no execution. The only `dangerouslySetInnerHTML` (`ui/chart.tsx`) is unused and fed developer data. | No change needed; new CSP (`script-src 'self'`, no inline/eval) is defense-in-depth. |
| **Clickjacking** | Framing the storefront in a hostile page. | Defended in production by `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` (header-level; not exercisable on the local dev server). | Verify post-deploy via `curl -I` / securityheaders.com. |
| **Prototype pollution / cart tampering** | Reviewed the `localStorage` (`moonbase_session`) JSON parse → cart hydration path. | No merge-into-prototype sink; tampered prices are display-only (Moonbase charges server-side). | No change needed. |

### Extended assessment — 12 attack classes, each adversarially verified

A second pass mapped twelve attack classes to the library's skills, analyzed each
against the real code, and ran an adversarial skeptic on every finding. Most are
**already mitigated or do not apply** to a backend-less static SPA. Verdicts:

| Attack class | Works in prod? | Severity | Outcome |
| --- | --- | --- | --- |
| Email/domain spoofing (SPF/DKIM/DMARC) | Yes (infra/DNS) | **Medium** | Documented below — DNS records, owner action |
| Supply-chain / lockfile drift | Yes | Low | **Fixed** — removed stale `bun.lockb`, added `netlify.toml` (`npm ci`) |
| CSP over-permissive (multi-tenant wildcard) | Header ships; no live exploit | Low | **Fixed** — pinned `script-src`/`form-action` to exact tenant host |
| Activation token in URL | Yes | Low | **Fixed** — `Activate.tsx` scrubs token via `history.replaceState` |
| Newsletter email written to localStorage | Yes | Low | **Fixed** — `newsletter.ts` no longer persists PII in prod |
| Subdomain takeover / dangling DNS | Infra | Low | CSP blast-radius reduced; DNS monitoring documented |
| Bot registration / form abuse | No (no backend; Moonbase owns signup) | None | No code fix; Moonbase dashboard confirms CAPTCHA/rate-limit |
| Credential stuffing / brute-force | No (prototype-only, no endpoint) | None | Delegated to Moonbase; prototype never ships |
| Business logic / price tampering / IDOR | No (Moonbase prices server-side) | None | Price never sent; `/order/:id` ownership-scoped |
| Web cache deception / host-header | No (static shell, non-cookie auth) | None | Class doesn't apply |
| Clickjacking / reverse tabnabbing | Header ships | None | XFO + `frame-ancestors` + COOP cover it; no `_blank` in our code |
| Security-headers / TLS completeness | Header ships | None | Suite correct as shipped — do **not** add COEP/CORP or weaken COOP |

In-repo fixes applied from this pass: `src/lib/newsletter.ts`, `src/pages/Activate.tsx`,
`public/_headers` (CSP), `netlify.toml` (+ `bun.lockb` removal).

## Residual risks (accepted / to monitor)

1. **`uuid < 11.1.1` (moderate, transitive)** — pulled in by
   `@moonbase.sh/storefront → @moonbase.sh/vue`. Advisory
   [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) only
   bites when `uuid` is called with an attacker-controlled `buf` argument, which
   the SDK's internal ID generation does not do. **No upstream fix yet** — we
   can't override a transitive dep of a third-party SDK without risking the
   integration. *Action:* bump `@moonbase.sh/storefront` when they ship a build
   on `uuid ≥ 11.1.1`.
2. **`vitest < 4.1.0` (critical, dev-only)** — advisory
   [GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp) is an
   arbitrary-file-read in the **Vitest UI server** (`vitest --ui`). This project
   never runs the UI server and `vitest` is a `devDependency` that **never ships
   to production**, so it is not part of the website's attack surface. *Action
   (optional):* `npm audit fix --force` upgrades to `vitest@4` (a breaking major
   for the test runner only) and re-run `npm test`.
3. ~~**localStorage prototype still in the bundle**~~ — **Resolved.** The
   prototype (djb2 auth, mock-card processor, localStorage cart/credential
   store, and the `?next=` redirect flow) was deleted entirely. Moonbase is now
   the sole backend; the insecure-but-unreachable code no longer exists, and the
   production bundle shrank ~28 KB.

## Compliance checklist

### PCI DSS
- We never receive, transmit, or store cardholder data in production — Moonbase
  and its processor handle it in their own iframe/origin. This makes us eligible
  for the lightest self-assessment (**SAQ A**-style scope).
- **Confirm with Moonbase** that they are a PCI DSS Level 1 service provider and
  request their Attestation of Compliance (AoC) for your records.
- The card-collecting prototype was **removed entirely** (not just guarded), so
  no card-handling code exists in the codebase at all — production scope is
  minimal by construction.

### GDPR / UK GDPR / CCPA
- ✅ Privacy policy discloses data collected (email), purpose, the Moonbase
  processor, and data-subject rights with a working contact.
- ✅ No third-party analytics, trackers, fingerprinting, or advertising cookies;
  only strictly-necessary storage (cart/session). A cookie-consent banner is
  generally **not required** for strictly-necessary storage only — re-evaluate
  if analytics are ever added.
- ⬜ **Sign a Data Processing Agreement (DPA) with Moonbase** (and your email
  provider) — required where they process EU/UK personal data on your behalf.
- ⬜ Confirm where Moonbase stores data and that international-transfer
  safeguards (e.g. SCCs) are in place if outside the EEA/UK.
- ⬜ The legal copy is engineering-grade, not lawyer-reviewed. Have counsel
  review `src/copy.ts → legal` before relying on it.

### Email authentication & domain-impersonation (DNS — owner action, highest real-world value)

`entropiaudio.com` publicly advertises `contact@`/`security@` addresses and sends
license-key + marketing email, making it a prime spoofing/phishing target. The
**only medium-severity finding** in the assessment: without published email-auth
records, anyone can forge `From: entropiaudio.com` ("your license was revoked,
re-enter payment") to your real customers. This is a DNS fix, not code — publish
on the registrar / Netlify DNS, then ramp:

- **SPF** (TXT @ apex): `v=spf1 include:<Moonbase/ESP sending domain> ~all` →
  tighten to `-all` once every legitimate sender is enumerated.
- **DKIM**: enable signing in the Moonbase/ESP dashboard, publish the generated
  `selector._domainkey.entropiaudio.com` record.
- **DMARC** (TXT @ `_dmarc.entropiaudio.com`): start
  `v=DMARC1; p=none; rua=mailto:dmarc@entropiaudio.com; fo=1; adkim=s; aspf=s`,
  monitor aggregate reports ~2 weeks, then escalate `p=none → quarantine → reject`.
- **Null MX** (`. 0`) on any name that never sends mail.
- **Verify:** `dig +short TXT _dmarc.entropiaudio.com`; send a test through the ESP
  and confirm `spf=pass` + `dkim=pass` + `dmarc=pass` (mail-tester.com).
- **Lookalikes:** schedule `dnstwist entropiaudio.com` + crt.sh CT-log alerts for
  confusable domains; defensively register the highest-risk typos/TLDs.

### Domain & vendor lifecycle (infrastructure)
- ⬜ Enable registrar **auto-renew + registry lock** on `entropiaudio.com`; never
  leave a CNAME pointing at a deleted Netlify site (subdomain-takeover risk).
- ⬜ Confirm in the **Moonbase dashboard**: login rate-limiting, account lockout,
  breached-password rejection, and signup CAPTCHA are enabled (these own the
  bot-registration / credential-stuffing surface, which is not in this repo).
- ⬜ Schedule takeover scans (subjack/BadDNS/nuclei) + CT monitoring over
  `entropiaudio.com` and `*.entropiaudio.com`.

### Operational
- ⬜ Optional: submit the apex domain to the **HSTS preload list**
  (https://hstspreload.org) — only after confirming every subdomain is
  HTTPS-only. Add `; preload` to the `Strict-Transport-Security` header first.
- ⬜ Re-run `npm audit` on a schedule and after every dependency bump.
- ✅ Deterministic builds: `netlify.toml` pins `npm ci` (fails on lockfile drift);
  `bun.lockb` removed so `package-lock.json` is the single source of truth.

## Verifying the headers after deploy
```sh
curl -sI https://entropiaudio.com | grep -iE 'content-security|strict-transport|x-frame|x-content|referrer|permissions-policy'
```
Or paste the URL into https://securityheaders.com and aim for an A/A+ grade.

# entropia audio, website

The marketing + storefront site for **entropia audio**, a small studio building serious audio plugins for serious sound.

The flagship product is **Chaosverb**: a studio reverb with a chaos engine inside.

## stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **React Router** for routing
- **TanStack Query** for data fetching
- **Moonbase storefront** for commerce
- **Vitest** + **Testing Library** for tests

## development

```sh
npm install
npm run dev        # local dev server on :8080
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # eslint
npm test           # run tests once
npm run test:watch # watch mode
```

## project layout

- `index.html`, page shell + SEO meta
- `src/copy.ts`, all marketing copy lives here
- `src/pages/`, route components
- `src/components/`, shared UI
- `public/screenshots/`, product imagery

## storefront (moonbase)

Commerce is delegated to a Moonbase embedded storefront. The integration is
**path B**, the site's marketing/account/cart pages stay; Moonbase's modal
owns sign-in, sign-up, cart mutations, checkout, and account management.

To enable in any environment:

1. Set `VITE_MOONBASE_URL` to the storefront URL (e.g. `https://entropiaudio.moonbase.sh`).
2. In the Moonbase admin, whitelist every origin that needs to embed,
   `https://entropiaudio.com`, the Netlify URL, and `http://localhost:8080`.
3. For Netlify, add the same env var under
   *site settings → environment variables* and trigger a fresh deploy.

Leaving `VITE_MOONBASE_URL` unset keeps the localStorage prototype in play,
useful for offline dev. The prototype is **not** safe for real customer data.

## deploy

The site auto-deploys from `main` via Netlify.

## contact

contact@entropiaudio.com

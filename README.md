# entropia audio — website

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

- `index.html` — page shell + SEO meta
- `src/copy.ts` — all marketing copy lives here
- `src/pages/` — route components
- `src/components/` — shared UI
- `public/screenshots/` — product imagery

## deploy

The site auto-deploys from `main` via Netlify.

## contact

contact@entropiaudio.com

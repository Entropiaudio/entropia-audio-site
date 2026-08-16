## What changed

<!-- What this does and why, in a couple of sentences. If it fixes something,
     say what was actually wrong — the cause, not just the symptom. -->


## Screenshots

<!-- Required for anything user-visible. Delete this section if nothing renders
     differently. -->

| Before | After |
| --- | --- |
|  |  |


## Checks

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build` — needs `VITE_MOONBASE_URL`; a production build hard-fails without it

<!-- If something was already failing on main, say so here rather than leaving a
     box unticked. -->


## House rules

<!-- Tick what this PR touches, delete the rest. Full detail in CLAUDE.md. -->

- [ ] **Copy** — new user-facing strings live in `src/copy.ts`, not inlined in components
      (tab title and SEO meta are the exception — those stay in `index.html`)
- [ ] **Tokens** — colours come from `src/index.css`; no raw hex in components
- [ ] **Motion** — timings imported from `src/components/motion/timing.ts`, never hardcoded;
      reduced motion still respected
- [ ] **Deps** — `package.json` and `package-lock.json` committed together, both written by
      `npm install`; the lockfile was not hand-edited (Netlify runs `npm ci`)
- [ ] **New external origin** — added to the CSP in `public/_headers`, and `SECURITY.md`
      is still accurate
- [ ] **Storefront** — touches Moonbase, auth, cart, checkout, or activation

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { inkSavePlugin } from "./scripts/ink-save-plugin";
import { sharePagesPlugin } from "./scripts/share-pages-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Storefront-integrity guard. Moonbase is the ONLY backend for accounts, cart,
  // and checkout (the old localStorage prototype was removed). Without
  // VITE_MOONBASE_URL the storefront is non-functional, so a production build
  // with no Moonbase URL is a hard error rather than a silently broken deploy.
  // `build:dev` (mode=development) is exempt for offline/non-prod builds.
  //
  // loadEnv only reads .env files; Netlify injects env vars via the real
  // process environment, so check both sources.
  const env = loadEnv(mode, process.cwd(), "");
  const moonbaseUrl = process.env.VITE_MOONBASE_URL ?? env.VITE_MOONBASE_URL;
  if (mode === "production" && !moonbaseUrl) {
    throw new Error(
      "[entropia build] VITE_MOONBASE_URL is not set for a production build. " +
        "Refusing to build: Moonbase is the only storefront backend, so without " +
        "it accounts/cart/checkout do nothing. Set VITE_MOONBASE_URL in your " +
        "environment (Netlify → site settings → environment variables) and " +
        "rebuild, or use `npm run build:dev` for a non-production build.",
    );
  }

  return {
    server: {
      host: "::",
      // PORT lets the Claude preview tooling assign a free port per session;
      // 8080 stays the default for a plain `npm run dev`.
      port: Number(process.env.PORT) || 8080,
      hmr: {
        overlay: false,
      },
    },
    // inkSavePlugin is `apply: "serve"` — the ink editor's save endpoint exists
    // in `npm run dev` only and is never part of a build. sharePagesPlugin is
    // build-only: it writes dist/plugins/<slug>.html so shared product links
    // preview with the plugin's GUI (see scripts/share-pages-plugin.ts).
    plugins: [react(), inkSavePlugin(), sharePagesPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});

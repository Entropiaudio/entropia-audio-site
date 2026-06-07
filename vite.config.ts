import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rolldownOptions: {
        // style-vendorizer is a missing peer dep inside @creit.tech/stellar-wallets-kit →
        // @twind/preset-autoprefix. Externalizing it prevents Rolldown from failing the build.
        // node:buffer / node:crypto are Node built-ins used by @stellar/stellar-sdk;
        // the browser runtime stubs them via the existing polyfill layer.
        external: ["style-vendorizer", "node:buffer", "node:crypto", "node:stream", "node:util"],
      },
    },
    optimizeDeps: {
      // Exclude the wallets-kit from pre-bundling so its internal twind dep isn't
      // analyzed by Rolldown during dep-scan.
      exclude: ["@creit.tech/stellar-wallets-kit"],
    },
  },
});

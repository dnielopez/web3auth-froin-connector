import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Polyfill process (including process.nextTick) and Buffer
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Handles 'node:' protocol imports used by Web3Auth v11 internals
      protocolImports: true,
    }),
  ],
  define: {
    global: "globalThis",
  },
});

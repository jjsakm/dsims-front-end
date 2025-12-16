import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 100000000,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".ts": "tsx",
        ".tsx": "tsx",
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 스프링 서버 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
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

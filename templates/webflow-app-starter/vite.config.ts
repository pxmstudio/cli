import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import wfHotReload from "@xatom/wf-app-hot-reload";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [wfHotReload(), react(), tailwindcss()] as any[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ isSsrBuild }) => ({
  root: path.resolve(__dirname, "client"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: isSsrBuild
      ? path.resolve(__dirname, "dist/ssr")
      : path.resolve(__dirname, "dist/client"),
    manifest: !isSsrBuild,
    ssrManifest: !isSsrBuild,
    rollupOptions: {
      input: isSsrBuild
        ? path.resolve(__dirname, "client/src/entry-server.tsx")
        : path.resolve(__dirname, "client/index.html"),
    },
  },
  appType: "custom",
}));

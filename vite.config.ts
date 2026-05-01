import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const basePath = env?.GITHUB_PAGES === "true" ? "/sport-perso/" : "/";
const buildTime = new Date().toISOString();

export default defineConfig({
  base: basePath,
  define: {
    __APP_BUILD_TIME__: JSON.stringify(buildTime)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Sport Progress Tracker",
        short_name: "Sport Track",
        description: "Suivi sport, nutrition, progression et programmes en local-first.",
        theme_color: "#00354A",
        background_color: "#F4F4EE",
        display: "standalone",
        orientation: "portrait",
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: `${basePath}icon.svg`,
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ]
});

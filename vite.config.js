import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      // Evita que la navegación de la PWA devuelva index.html
      // cuando se solicita directamente un archivo estático.
      workbox: {
        navigateFallbackDenylist: [
          /\/.*\.(?:png|jpe?g|gif|svg|webp|ico|xlsx|pdf|woff2?)$/i,
        ],
      },

      manifest: {
        name: "DIAEMEX",
        short_name: "DIAEMEX",
        description:
          "Catálogo de equipos, consumibles y refacciones para soldadura y corte.",
        theme_color: "#0f172a",
        background_color: "#f5f7fa",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['xlsx']
  },
  build: {
    chunkSizeWarningLimit: 1600
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "HMS",
        short_name: "HMS",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        scope: "/",
        categories: ["productivity"],
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000"
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf}']
      }
    })

  ],
})

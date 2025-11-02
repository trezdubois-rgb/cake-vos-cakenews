import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// Force refresh
=======
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
<<<<<<< HEAD
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB to accommodate Gutenberg
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/], // Allow all routes except those starting with /__
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      manifest: {
        name: "CakeVos Cakenews",
        short_name: "Cakenews",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ff4081",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ].filter(Boolean),
=======
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'editor-vendor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-link'],
          'charts-vendor': ['recharts'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  }
}));
=======
}));
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

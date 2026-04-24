import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000, // 3MB
      },
      manifest: {
        name: 'Escala Pratique',
        short_name: 'Escala',
        description: 'Gerenciador de Escalas Pratique Fitness',
        theme_color: '#e50914',
        background_color: '#f8f9fa',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'styled-components', 'firebase/app', 'firebase/firestore'],
          icons: ['react-icons/fa', 'react-icons/fa6'],
          pdf: ['@react-pdf/renderer']
        }
      }
    }
  },
  server: {
    open: true,
  },
})

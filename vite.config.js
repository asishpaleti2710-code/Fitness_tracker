import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Fitness Tracker Premium',
        short_name: 'FitTrack',
        description: 'Your personal fitness companion.',
        theme_color: '#7c4dff',
        background_color: '#1a1a2e',
        display: 'standalone',
        icons: [
          {
            src: 'app_logo.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'app_logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0'
  }
})

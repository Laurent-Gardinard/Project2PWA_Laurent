/*
File: vite.config.js
*/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Avis et Alertes Montréal',
        short_name: 'AvisAlertes',
        description: 'Consultez les alertes émises par la Ville de Montréal',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/donnees\.montreal\.ca\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache'
            }
          },
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tile-cache'
            }
          }
        ]
      }
    })
  ]
});
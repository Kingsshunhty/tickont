import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TicketMaster',
        short_name: 'TicketMaster',
        start_url: '/',
        display: 'standalone',
        theme_color: '#024ddf',
        background_color: '#ffffff',
        icons: [
          {
            src: '/ticketmaster.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/ticketmaster.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  build: {
    outDir: "dist", // Ensure Vite outputs to 'dist'
  },
})

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/apis': 'http://localhost:8080',
    },
    hmr: {
    overlay: false,
  },
  },
})

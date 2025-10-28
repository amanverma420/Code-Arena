import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://10.1.231.115:3000',
        changeOrigin: true,
      },
    },
  },
})

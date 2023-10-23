import dotenv from 'dotenv'
import { fileURLToPath, URL } from 'node:url'

dotenv.config()

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: process.env.VITE_APP_PORT || 8080
  }
})

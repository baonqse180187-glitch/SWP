import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // Match với app.frontend.url trong backend
    host: '0.0.0.0', // Allow external access
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Không rewrite path vì backend đã có /api prefix
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})

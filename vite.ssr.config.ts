import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/ssr.tsx',
    outDir: 'dist/ssr',
    copyPublicDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'index.js'
      }
    }
  }
})

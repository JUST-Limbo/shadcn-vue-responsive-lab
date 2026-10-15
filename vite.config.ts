import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: { port: 5178, strictPort: true },
  preview: { port: 4178, strictPort: true },
  test: { environment: 'happy-dom', include: ['src/**/*.test.ts'] },
})

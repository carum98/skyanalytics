import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '@assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./app/components', import.meta.url)),
      '@views': fileURLToPath(new URL('./app/views', import.meta.url)),
      '@composables': fileURLToPath(new URL('./app/composables', import.meta.url)),
      '@ui': fileURLToPath(new URL('./app/components/ui', import.meta.url)),
	  '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    }
  }
})

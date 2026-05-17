import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ['vue', 'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  }
})

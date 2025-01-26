import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import copy from 'vite-plugin-static-copy'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  copy({
    targets: [
      { src: '_redirects', dest: '' }
    ]
  })],
})

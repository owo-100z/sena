import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import AutoImport from 'unplugin-auto-import/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      dirs: ['src/assets/common'],
    })
  ],
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'src/assets/common/common.js'),
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
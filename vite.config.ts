import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      formats: ['es', 'cjs'],
      entry: 'src/index',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  plugins: [vue(), vueJSX()],
  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      'vue3-image-cropper': path.resolve('src/index.ts'),
    },
  },
})

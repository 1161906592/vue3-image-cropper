import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJSX()],
  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      'vue3-image-cropper': path.resolve('src'),
    },
  },
})

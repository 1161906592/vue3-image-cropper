import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
import pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
    vue(),
    vueJSX(),
    pages({
      dirs: 'src/pages',
      exclude: ['**/components/**'],
      extensions: ['tsx'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variable.scss";\n\r@import "@/styles/mixin.scss";`,
      },
    },
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
      },
    },
  },
})

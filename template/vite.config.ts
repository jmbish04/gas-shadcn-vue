import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Configure for Google Apps Script compatibility
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Inline CSS and JS into HTML for GAS compatibility
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
    // Ensure assets are properly referenced
    assetsInlineLimit: 100000000, // Inline all assets
    // Target modern browsers since GAS supports modern JS
    target: 'es2020',
    minify: false, // Disable minification for GAS compatibility
  },
})

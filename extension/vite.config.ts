import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, '../common/src'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      fileName: '<your_extension_name>',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: '<your_extension_name>.[ext]',
      },
    },
  },
})

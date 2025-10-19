import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['shadergradient', 'three', '@react-three/fiber', '@react-three/drei']
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      'three/examples/jsm/': 'three/examples/jsm/'
    }
  }
})


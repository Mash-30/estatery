import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react'
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
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


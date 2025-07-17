import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173, // Important for Docker
      protocol: 'ws',
      host: 'localhost'
    },
    watch: {
      usePolling: true // Needed for Docker file system watching
    }
  },
  preview: {
    port: 5173,
    host: true
  }
})
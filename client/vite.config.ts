import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  build:{
    outDir:'../API/wwwroot',              // Tempat hasil build (ke folder ASP.NET)
    chunkSizeWarningLimit:1025,           // Naikkan batas peringatan ukuran file
    emptyOutDir:true                      // Bersihkan folder output sebelum build
  },
  server:{
    port:3000
  },
  plugins: [react(), mkcert()],
})

import MillionLint from '@million/lint';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Pages from "vite-plugin-pages";

export default defineConfig({
  plugins: [
    MillionLint.vite(),
    react(),
    Pages({ importMode: "sync" })
  ],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:8000',
      '/soketi': {
        target: 'http://localhost:6001',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/soketi/, '')
      }
    }
  }
});

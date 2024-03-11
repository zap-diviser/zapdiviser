import { ServerOptions, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default () => {
  const serverConfig: ServerOptions = {
    proxy: {
      '/webhook': {
        target: "http://localhost:8000/api/product",
        secure: false,
        changeOrigin: true,
      }
    },
    port: 8080,
    strictPort: true,
    host: true
  }

  return defineConfig({
    plugins: [tsconfigPaths(), react()],
    define: {
      'process.env': {
        BACKEND_URL: process.env.BACKEND_URL
      }
    },
    server: serverConfig,
    preview: serverConfig,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            redux: ['redux'],
          }
        }
      }
    }
  });
};

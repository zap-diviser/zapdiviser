import { ServerOptions, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { join } from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const env = loadEnv(mode, join(process.cwd(), '../'), '');

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
      'process.env': env
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

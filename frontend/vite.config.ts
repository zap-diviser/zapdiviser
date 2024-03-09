import { ServerOptions, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const env = loadEnv(mode, process.cwd(), '');

  const serverConfig: ServerOptions = {
    proxy: {
      '/api': {
        target: env.API_URL,
        secure: false,
        changeOrigin: true,
      },
      '/socket.io': {
        target: env.API_URL,
        ws: true,
        secure: false,
        changeOrigin: true,
      },
      '/webhook': {
        target: `${env.API_URL}/api/product`,
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

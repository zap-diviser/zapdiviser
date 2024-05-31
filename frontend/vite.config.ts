import { ServerOptions, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default () => {
  const serverConfig: ServerOptions = {
    port: 8080,
    strictPort: true,
    host: true,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  };

  return defineConfig({
    plugins: [tsconfigPaths(), react()],
    server: serverConfig,
    preview: serverConfig,
    envDir: '../',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            redux: ['redux']
          }
        }
      }
    },
  });
};

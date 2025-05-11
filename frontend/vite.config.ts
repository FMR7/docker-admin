import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isSSL = env.VITE_SSL === 'true';
  const apiPort = env.VITE_API_PORT || 3000;

  console.log('isSSL:', isSSL, 'apiPort:', apiPort);

  return {
    plugins: [preact(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: isSSL ? `https://localhost:${apiPort}` : `http://localhost:${apiPort}`,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});

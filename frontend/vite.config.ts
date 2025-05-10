import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Vite automáticamente expone variables que empiezan por VITE_
const isSSL = process.env.VITE_SSL === 'true';
const apiPort = process.env.VITE_API_PORT || (3000);

export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/api': {
        target: isSSL ? 'https://localhost:' + apiPort : 'http://localhost:' + apiPort,
        changeOrigin: true,
        secure: false, // porque el certificado es local
      }
    }
  }
});

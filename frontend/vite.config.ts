import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Vite automáticamente expone variables que empiezan por VITE_
const isSSL = process.env.VITE_SSL === 'true';

export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/api': {
        target: isSSL ? 'https://localhost' : 'http://localhost',
        changeOrigin: true,
        secure: false, // porque el certificado es local
      }
    }
  }
});

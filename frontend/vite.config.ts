import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isSSL = env.VITE_SSL === 'true';
  const apiPort = env.VITE_API_PORT ?? 3000;
  const apiHost = env.VITE_API_HOST ?? 'localhost';


  console.log('🌐 API PORT:', apiPort);
  if (isSSL) {
    console.log('✅ API SSL is enabled');
  } else {
    console.warn('⚠️  API SSL is disabled');
  }

  return {
    plugins: [preact(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: isSSL ? `https://${apiHost}:${apiPort}` : `http://${apiHost}:${apiPort}`,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});

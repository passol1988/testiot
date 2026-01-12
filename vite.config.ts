import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_PUBLIC_URL,
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Coze API requests to avoid CORS
      '/api/coze': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coze/, ''),
        secure: false,
      },
    },
  },
});

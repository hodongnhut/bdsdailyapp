import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Khi frontend gọi /api/..., Vite sẽ chuyển hướng đến https://app.bdsdaily.com/api/...
      '/api': {
        target: 'https://app.bdsdaily.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
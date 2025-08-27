import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: ['app.wos-community.com', 'host.docker.internal'],
  },
  build: {
    outDir: 'build',
  },
});

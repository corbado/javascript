import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        auth: resolve(__dirname, 'src/pages/auth.html'),
      },
    },
  },
});

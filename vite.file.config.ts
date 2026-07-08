import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: 'dist-file',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

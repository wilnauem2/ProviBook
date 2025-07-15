import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['content', 'template'].includes(tag),
        },
      },
    }),
  ],
  css: {
    postcss: {
      plugins: []
    }
  },
  base: '/',
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      strict: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    'import.meta.env.DEV': true,
    'import.meta.env.PROD': false
  }
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // Ensure Vite knows this is a production build
  process.env.NODE_ENV = isProduction ? 'production' : 'development';
  
  return {
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
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
    base: '/',
    build: {
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: false,
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'import.meta.env.PROD': isProduction,
      'import.meta.env.DEV': !isProduction,
    },
    optimizeDeps: {
      include: ['@vitejs/plugin-vue'],
      esbuildOptions: {
        target: 'es2020',
        supported: { 
          bigint: true 
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port: 8080,
      strictPort: true,
    },
    clearScreen: false,
  };
});

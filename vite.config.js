import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // Ensure Vite knows this is a production build
  process.env.NODE_ENV = isProduction ? 'production' : 'development';
  
  return {
    base: isProduction ? '/' : './',
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
    build: {
      target: 'es2020',
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) {
                return 'vendor-vue';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              return 'vendor';
            }
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
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

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { fileURLToPath, URL } from 'url';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  const isProduction = mode === 'production';
  const isTesting = process.env.VITE_GIT_BRANCH === 'testing';
  // Load env variables based on the mode (development, production)
  const env = loadEnv(mode, process.cwd());

  return {
    base: isProduction ? '/' : '/',  // Use absolute paths for both dev and prod
    publicDir: 'public',

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 3001,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3001
      },
      fs: {
        strict: true,
      },
    },
    preview: {
      port: 3001,
      strictPort: true,
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: !isProduction,
      emptyOutDir: true,
      outDir: 'publish',
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL(isTesting ? './index.html' : './index.prod.html', import.meta.url))
        },
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
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
    },
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
    clearScreen: false,
  };
});

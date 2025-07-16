import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { fileURLToPath, URL } from 'url';
import { execSync } from 'child_process';

// Get current git branch
const gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    define: {
      'import.meta.env.VITE_GIT_BRANCH': JSON.stringify(gitBranch),
    },
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
      rollupOptions: {
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

import { build } from 'vite';
import path from 'path';

async function buildProd() {
  try {
    await build({
      root: path.resolve(__dirname, '../'),
      base: '/',
      build: {
        target: 'es2020',
        minify: true,
        sourcemap: false,
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, '../index.html')
          },
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        },
        manifest: true,
        emptyOutDir: true
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'import.meta.env.PROD': true
      }
    });
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProd();

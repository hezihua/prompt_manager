import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // 复制 manifest.json 到输出目录
        const manifestSrc = resolve(__dirname, 'public/manifest.json');
        const manifestDest = resolve(__dirname, 'dist/manifest.json');
        try {
          copyFileSync(manifestSrc, manifestDest);
          console.log('✓ Manifest copied to dist/');
        } catch (error) {
          console.error('Failed to copy manifest:', error);
        }

        // 复制 icons 目录
        const iconsSrc = resolve(__dirname, 'public/icons');
        const iconsDest = resolve(__dirname, 'dist/icons');
        try {
          mkdirSync(iconsDest, { recursive: true });
          const files = readdirSync(iconsSrc);
          files.forEach((file: string) => {
            copyFileSync(
              resolve(iconsSrc, file),
              resolve(iconsDest, file)
            );
          });
          console.log('✓ Icons copied to dist/');
        } catch (error) {
          console.error('Failed to copy icons:', error);
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/service-worker.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // 将 HTML 文件输出到正确的位置
          if (assetInfo.name?.endsWith('.html')) {
            if (assetInfo.name.includes('sidepanel')) {
              return 'sidepanel/index.html';
            }
            if (assetInfo.name.includes('popup')) {
              return 'popup/index.html';
            }
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});

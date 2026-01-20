import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pagesのサブディレクトリ（リポジトリ名）に対応するため相対パスを設定
  base: './',
  build: {
    outDir: 'dist',
  },
});
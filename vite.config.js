import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  define: {
    'process.env': {},
    global: {},
  },
  build: {
    target: 'esnext',            // 최신 브라우저 대상으로 빌드 (더 빠름)
    minify: 'esbuild',            // Terser 대신 esbuild로 코드 압축 (최대 2~3배 빠름)
    sourcemap: false,             // 소스맵 제거 (불필요한 빌드 시간 절약)
    chunkSizeWarningLimit: 2000,  // 경고 제한 확장 (옵션)
    rollupOptions: {
      output: {
        manualChunks: undefined,  // 코드 분할 최소화 (빌드 시간 단축)
      },
    },
  },
  esbuild: {
    legalComments: 'none',        // 불필요한 라이선스 주석 제거
    treeShaking: true,            // 사용하지 않는 코드 제거로 최적화
  },
});
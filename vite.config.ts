/**
 * @file vite.config.ts - Vite 빌드 도구 설정
 *
 * - react(): React JSX 변환 및 Fast Refresh 지원
 * - tailwindcss(): Tailwind CSS v4 Vite 플러그인
 * - '@' 별칭(alias): src/ 디렉토리를 '@'로 참조 가능 (예: '@/components/...')
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})

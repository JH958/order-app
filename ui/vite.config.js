import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 빌드 시 환경 변수 확인
console.log('=== Vite 빌드 설정 ===')
console.log('VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL || 'NOT SET')
console.log('NODE_ENV:', process.env.NODE_ENV || 'development')

// 프로덕션 환경에서 API 베이스 URL 설정
// Render.com의 환경 변수 또는 .env.production 파일에서 읽어옴
// 둘 다 없으면 기본값 사용
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://order-app-backend-i18w.onrender.com/api'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // 빌드 시 환경 변수를 코드에 주입
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(API_BASE_URL)
  }
})

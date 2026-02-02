import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 빌드 시 환경 변수 확인
console.log('=== Vite 빌드 설정 ===')
console.log('VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL || 'NOT SET')
console.log('NODE_ENV:', process.env.NODE_ENV || 'development')

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
  }
})

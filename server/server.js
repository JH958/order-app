import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import pool from './config/database.js';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: '커피 주문 앱 백엔드 서버',
    version: '1.0.0',
    endpoints: {
      menus: '/api/menus',
      orders: '/api/orders',
      inventory: '/api/inventory',
      dashboard: '/api/dashboard/stats'
    }
  });
});

// API 라우트 (추후 추가 예정)
// app.use('/api/menus', menuRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  
  // 데이터베이스 연결 테스트
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`✅ 데이터베이스 연결 성공: ${process.env.DB_NAME || 'coffee_order_db'}`);
    console.log(`   연결 시간: ${result.rows[0].now}`);
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
  }
});

export default app;

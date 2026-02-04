import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import pool from './config/database.js';
import { ensureCategoryColumn } from './utils/migrateDatabase.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
// CORS 설정: 프로덕션에서는 프론트엔드 도메인만 허용
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || '*') // FRONTEND_URL이 없으면 모든 origin 허용
    : '*', // 개발 환경에서는 모든 origin 허용
  credentials: true
};

// CORS 설정 로깅 (디버깅용)
console.log('CORS 설정:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('  Allowed Origin:', corsOptions.origin);

app.use(cors(corsOptions));
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

// API 라우트
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  
  // 데이터베이스 연결 테스트 및 마이그레이션
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`✅ 데이터베이스 연결 성공: ${process.env.DB_NAME || 'coffee_order_db'}`);
    console.log(`   연결 시간: ${result.rows[0].now}`);
    
    // category 컬럼 자동 마이그레이션
    await ensureCategoryColumn();
    
    // 메뉴 데이터 확인
    const menuCount = await pool.query('SELECT COUNT(*) as count FROM menus');
    const count = parseInt(menuCount.rows[0].count);
    console.log(`📊 현재 메뉴 개수: ${count}개`);
    if (count === 0) {
      console.warn('⚠️  메뉴 데이터가 없습니다. seed 스크립트를 실행해야 합니다:');
      console.warn('   Render.com Shell에서: cd server && npm run seed');
    }
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
  }
});

export default app;

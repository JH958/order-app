// 데이터베이스 연결 설정
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Render.com에서는 DATABASE_URL을 제공하므로 이를 우선 사용
let pool;

if (process.env.DATABASE_URL) {
  // DATABASE_URL이 있으면 SSL 연결 사용 (Render.com)
  // Render.com의 PostgreSQL은 항상 SSL을 요구함
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // 개별 환경 변수 사용 (로컬 개발)
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });
}

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ 데이터베이스 연결 성공');
});

pool.on('error', (err) => {
  console.error('❌ 데이터베이스 연결 오류:', err);
  process.exit(-1);
});

export default pool;

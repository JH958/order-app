// Menus 테이블에 category 컬럼 추가 스크립트
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coffee_order_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function addCategoryColumn() {
  try {
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    // category 컬럼이 있는지 확인
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'menus' AND column_name = 'category'
    `);

    if (checkResult.rows.length === 0) {
      // category 컬럼 추가
      await client.query(`
        ALTER TABLE menus 
        ADD COLUMN category VARCHAR(50) DEFAULT 'coffee'
      `);
      console.log('✅ category 컬럼 추가 완료');
      
      // 기존 메뉴는 모두 coffee로 설정
      await client.query(`
        UPDATE menus SET category = 'coffee' WHERE category IS NULL
      `);
      console.log('✅ 기존 메뉴 카테고리 설정 완료');
    } else {
      console.log('✅ category 컬럼이 이미 존재합니다.');
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 컬럼 추가 오류:');
    console.error(error.message);
    await client.end();
    process.exit(1);
  }
}

addCategoryColumn();

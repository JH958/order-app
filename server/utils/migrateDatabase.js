// 데이터베이스 마이그레이션 유틸리티
import pool from '../config/database.js';

/**
 * category 컬럼이 없으면 추가
 */
export async function ensureCategoryColumn() {
  try {
    // category 컬럼이 있는지 확인
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'menus' AND column_name = 'category'
    `);

    if (checkResult.rows.length === 0) {
      console.log('📦 category 컬럼이 없습니다. 추가 중...');
      
      // category 컬럼 추가
      await pool.query(`
        ALTER TABLE menus 
        ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'coffee'
      `);
      
      // CHECK 제약 조건 추가 (제약 조건이 없을 수 있으므로 try-catch로 처리)
      try {
        await pool.query(`
          ALTER TABLE menus 
          DROP CONSTRAINT IF EXISTS menus_category_check
        `);
        await pool.query(`
          ALTER TABLE menus 
          ADD CONSTRAINT menus_category_check 
          CHECK (category IN ('coffee', 'non-coffee', 'etc'))
        `);
      } catch (constraintError) {
        // 제약 조건 추가 실패해도 계속 진행
        console.log('⚠️  제약 조건 추가 중 오류 (무시됨):', constraintError.message);
      }
      
      // 기존 메뉴는 모두 coffee로 설정
      await pool.query(`
        UPDATE menus SET category = 'coffee' WHERE category IS NULL
      `);
      
      console.log('✅ category 컬럼 추가 완료');
    } else {
      console.log('✅ category 컬럼이 이미 존재합니다.');
    }
  } catch (error) {
    console.error('❌ category 컬럼 확인/추가 중 오류:', error.message);
    // 오류가 발생해도 서버는 계속 실행되도록 함
  }
}

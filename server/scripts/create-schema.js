// 데이터베이스 스키마 생성 스크립트
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Render.com에서는 DATABASE_URL을 제공하므로 이를 우선 사용
let clientConfig;

if (process.env.DATABASE_URL) {
  // DATABASE_URL이 있으면 SSL 연결 사용 (Render.com)
  clientConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // 개별 환경 변수 사용
  const host = process.env.DB_HOST || 'localhost';
  const isRenderDB = host.includes('render.com');
  
  clientConfig = {
    host: host,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    // Render.com 데이터베이스는 SSL 필요
    ssl: isRenderDB ? {
      rejectUnauthorized: false
    } : false
  };
}

const client = new Client(clientConfig);

async function createSchema() {
  try {
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    // 테이블 생성
    console.log('테이블 생성 중...');

    // 1. Menus 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL CHECK (price >= 0),
        image VARCHAR(500),
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        category VARCHAR(50) DEFAULT 'coffee' CHECK (category IN ('coffee', 'non-coffee', 'etc')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Menus 테이블 생성 완료');
    
    // category 컬럼이 없는 경우 추가 (기존 테이블 마이그레이션)
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'menus' AND column_name = 'category'
    `;
    const columnExists = await client.query(checkColumnQuery);
    
    if (columnExists.rows.length === 0) {
      console.log('category 컬럼 추가 중...');
      await client.query(`
        ALTER TABLE menus 
        ADD COLUMN category VARCHAR(50) DEFAULT 'coffee' 
        CHECK (category IN ('coffee', 'non-coffee', 'etc'))
      `);
      // 기존 데이터의 category 설정
      await client.query(`
        UPDATE menus SET category = 'coffee' WHERE category IS NULL
      `);
      console.log('✅ category 컬럼 추가 완료');
    } else {
      console.log('✅ category 컬럼이 이미 존재합니다.');
    }

    // 2. Options 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL CHECK (price >= 0),
        menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Options 테이블 생성 완료');

    // 3. Orders 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
        status VARCHAR(50) NOT NULL DEFAULT '주문 접수' 
          CHECK (status IN ('주문 접수', '제조 중', '제조 완료', '픽업 완료')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Orders 테이블 생성 완료');

    // 4. OrderItems 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_id INTEGER NOT NULL REFERENCES menus(id),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        item_price INTEGER NOT NULL CHECK (item_price >= 0),
        total_price INTEGER NOT NULL CHECK (total_price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ OrderItems 테이블 생성 완료');

    // 5. OrderItemOptions 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_item_options (
        id SERIAL PRIMARY KEY,
        order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
        option_id INTEGER NOT NULL REFERENCES options(id),
        option_price INTEGER NOT NULL CHECK (option_price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ OrderItemOptions 테이블 생성 완료');

    // 인덱스 생성
    console.log('인덱스 생성 중...');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_options_menu_id ON options(menu_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_order_time ON orders(order_time DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_order_item_options_order_item_id ON order_item_options(order_item_id)
    `);
    
    console.log('✅ 인덱스 생성 완료');

    // updated_at 자동 업데이트를 위한 트리거 함수 생성
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 트리거 생성
    await client.query(`
      DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
      CREATE TRIGGER update_menus_updated_at
        BEFORE UPDATE ON menus
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_options_updated_at ON options;
      CREATE TRIGGER update_options_updated_at
        BEFORE UPDATE ON options
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
      CREATE TRIGGER update_orders_updated_at
        BEFORE UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ 트리거 생성 완료');

    console.log('\n✅ 데이터베이스 스키마 생성이 완료되었습니다!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 스키마 생성 오류:');
    console.error(error.message);
    await client.end();
    process.exit(1);
  }
}

createSchema();

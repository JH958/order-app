// 데이터베이스 연결 테스트 스크립트
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // 기본 데이터베이스에 연결하여 데이터베이스 존재 여부 확인
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function testConnection() {
  try {
    console.log('데이터베이스 연결 시도 중...');
    await client.connect();
    console.log('✅ PostgreSQL 서버에 연결되었습니다.');

    // 데이터베이스 존재 여부 확인
    const dbName = process.env.DB_NAME || 'coffee_order_db';
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (result.rows.length === 0) {
      console.log(`\n⚠️  데이터베이스 '${dbName}'가 존재하지 않습니다.`);
      console.log('데이터베이스를 생성하시겠습니까? (y/n)');
      console.log('\n수동으로 생성하려면 다음 명령어를 실행하세요:');
      console.log(`CREATE DATABASE ${dbName};`);
    } else {
      console.log(`✅ 데이터베이스 '${dbName}'가 존재합니다.`);
      
      // 실제 데이터베이스에 연결 테스트
      await client.end();
      const dbClient = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: dbName,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
      });

      await dbClient.connect();
      console.log(`✅ 데이터베이스 '${dbName}'에 성공적으로 연결되었습니다.`);
      
      // 간단한 쿼리 테스트
      const testResult = await dbClient.query('SELECT NOW() as current_time, version() as pg_version');
      console.log(`\n📅 현재 시간: ${testResult.rows[0].current_time}`);
      console.log(`📦 PostgreSQL 버전: ${testResult.rows[0].pg_version.split(',')[0]}`);
      
      await dbClient.end();
    }

    console.log('\n✅ 데이터베이스 연결 테스트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 데이터베이스 연결 오류:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL 서버가 실행 중인지 확인하세요.');
    } else if (error.code === '28P01') {
      console.error('\n💡 사용자 이름 또는 비밀번호가 올바른지 확인하세요.');
    } else if (error.code === '3D000') {
      console.error('\n💡 데이터베이스가 존재하지 않습니다. 데이터베이스를 생성하세요.');
    }
    
    process.exit(1);
  }
}

testConnection();

// 환경 변수 확인 스크립트
import dotenv from 'dotenv';

dotenv.config();

console.log('📋 환경 변수 확인:\n');

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL이 설정되어 있습니다.');
  // 보안을 위해 일부만 표시
  const url = process.env.DATABASE_URL;
  const maskedUrl = url.replace(/:[^:@]+@/, ':****@');
  console.log(`   ${maskedUrl}`);
} else {
  console.log('⚠️  DATABASE_URL이 설정되지 않았습니다.');
  console.log('\n개별 환경 변수:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || '(설정 안 됨)'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || '(설정 안 됨)'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || '(설정 안 됨)'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || '(설정 안 됨)'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '****' : '(설정 안 됨)'}`);
}

console.log('\n💡 Render.com 데이터베이스 연결 시:');
console.log('   - External Database URL을 사용해야 합니다 (로컬에서 연결 시)');
console.log('   - Internal Database URL은 Render 내부 서비스 간 통신용입니다');
console.log('\n.env 파일에 다음 형식으로 설정하세요:');
console.log('DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require');

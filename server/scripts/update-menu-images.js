// 메뉴 이미지 경로 업데이트 스크립트
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

// 메뉴명과 이미지 경로 매핑
const menuImages = {
  '아메리카노': '/images/아메리카노.jpg',
  '카페라떼': '/images/카페라떼.jpg',
  '카푸치노': '/images/카푸치노.jpg',
  '카페모카': '/images/카페모카.jpg',
  '카라멜 마키아토': '/images/카라멜 마키아토.jpg',
  '바닐라 라떼': '/images/바닐라 라떼.jpg',
  '자몽에이드': '/images/자몽에이드.jpg',
  '레몬에이드': '/images/레몬에이드.jpg',
  '밀크티': '/images/밀크티.jpg',
  '청귤에이드': '/images/청귤에이드.jpg',
  '유자차': '/images/유자차.jpg',
  '생강차': '/images/생강차.jpg',
  '아이스크림': '/images/아이스크림.jpg',
  '크로와상': '/images/크로와상.jpg',
  '마카롱': '/images/마카롱.jpg',
  '베이글': '/images/베이글.jpg',
  '머핀': '/images/머핀.jpg',
  '쿠키': '/images/쿠키.jpg'
};

async function updateMenuImages() {
  try {
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    console.log('메뉴 이미지 경로 업데이트 중...');
    
    for (const [menuName, imagePath] of Object.entries(menuImages)) {
      const result = await client.query(
        'UPDATE menus SET image = $1 WHERE name = $2',
        [imagePath, menuName]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ ${menuName}: ${imagePath}`);
      } else {
        console.log(`⚠️  ${menuName}: 메뉴를 찾을 수 없습니다.`);
      }
    }

    console.log('\n✅ 메뉴 이미지 경로 업데이트 완료!');
    console.log('\n💡 이미지 파일을 ui/public/images/ 폴더에 저장했는지 확인하세요.');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 이미지 경로 업데이트 오류:');
    console.error(error.message);
    await client.end();
    process.exit(1);
  }
}

updateMenuImages();

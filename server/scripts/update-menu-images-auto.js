// 메뉴 이미지 경로 자동 업데이트 스크립트
// ui/public/images/ 폴더의 이미지 파일명과 메뉴명을 매칭하여 자동으로 업데이트
import pg from 'pg';
import dotenv from 'dotenv';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coffee_order_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function updateMenuImagesAuto() {
  try {
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    // 이미지 파일 목록 가져오기
    const imagesPath = join(__dirname, '../../ui/public/images');
    const files = await readdir(imagesPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    console.log(`\n📁 발견된 이미지 파일: ${imageFiles.length}개`);
    imageFiles.forEach(file => console.log(`   - ${file}`));

    // 데이터베이스에서 모든 메뉴 가져오기
    const menuResult = await client.query('SELECT id, name FROM menus ORDER BY id');
    const menus = menuResult.rows;

    console.log(`\n📋 데이터베이스 메뉴: ${menus.length}개`);

    // 이미지 파일명과 메뉴명 매칭
    let updatedCount = 0;
    let notFoundCount = 0;

    for (const menu of menus) {
      // 이미지 파일 찾기 (확장자 제거한 파일명과 메뉴명 비교)
      const matchedImage = imageFiles.find(file => {
        const fileNameWithoutExt = file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
        return fileNameWithoutExt === menu.name;
      });

      if (matchedImage) {
        const imagePath = `/images/${matchedImage}`;
        await client.query(
          'UPDATE menus SET image = $1 WHERE id = $2',
          [imagePath, menu.id]
        );
        console.log(`✅ ${menu.name} → ${imagePath}`);
        updatedCount++;
      } else {
        console.log(`⚠️  ${menu.name}: 매칭되는 이미지 파일을 찾을 수 없습니다.`);
        notFoundCount++;
      }
    }

    console.log(`\n✅ 이미지 경로 업데이트 완료!`);
    console.log(`   - 업데이트된 메뉴: ${updatedCount}개`);
    console.log(`   - 이미지 없는 메뉴: ${notFoundCount}개`);
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 이미지 경로 업데이트 오류:');
    console.error(error.message);
    if (error.code === 'ENOENT') {
      console.error('\n💡 ui/public/images/ 폴더가 존재하는지 확인하세요.');
    }
    await client.end();
    process.exit(1);
  }
}

updateMenuImagesAuto();

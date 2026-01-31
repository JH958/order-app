// 초기 데이터 시드 스크립트
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

const menus = [
  // Coffee 메뉴
  {
    name: '아메리카노',
    description: '깔끔하고 진한 아메리카노',
    price: 4000,
    image: null,
    stock: 10,
    category: 'coffee',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    name: '카페라떼',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 5000,
    image: null,
    stock: 10,
    category: 'coffee',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    name: '카푸치노',
    description: '에스프레소와 스팀 우유, 거품의 완벽한 조합',
    price: 5000,
    image: null,
    stock: 10,
    category: 'coffee',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    name: '카페모카',
    description: '초콜릿과 에스프레소의 달콤한 만남',
    price: 5500,
    image: null,
    stock: 10,
    category: 'coffee',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    name: '카라멜 마키아토',
    description: '달콤한 카라멜과 에스프레소의 만남',
    price: 5500,
    image: null,
    stock: 10,
    category: 'coffee',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    name: '바닐라 라떼',
    description: '부드러운 바닐라 향이 가득한 라떼',
    price: 5500,
    image: null,
    stock: 10,
    category: 'coffee',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  // Non-coffee 메뉴
  {
    name: '자몽에이드',
    description: '상큼한 자몽과 탄산의 조화',
    price: 5500,
    image: null,
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '레몬에이드',
    description: '시원한 레몬에이드',
    price: 5000,
    image: null,
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '밀크티',
    description: '부드러운 우유와 홍차의 만남',
    price: 5000,
    image: null,
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '청귤에이드',
    description: '달콤한 청귤에이드',
    price: 5500,
    image: null,
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '유자차',
    description: '따뜻한 유자차',
    price: 4500,
    image: null,
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '생강차',
    description: '따뜻한 생강차',
    price: 4500,
    image: null,
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  // Etc 메뉴
  {
    name: '아이스크림',
    description: '부드러운 바닐라 아이스크림',
    price: 3000,
    image: null,
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '크로와상',
    description: '바삭한 크로와상',
    price: 4000,
    image: null,
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '마카롱',
    description: '달콤한 마카롱',
    price: 2500,
    image: null,
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '베이글',
    description: '쫄깃한 베이글',
    price: 3500,
    image: null,
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '머핀',
    description: '부드러운 머핀',
    price: 4000,
    image: null,
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '쿠키',
    description: '달콤한 쿠키',
    price: 2000,
    image: null,
    stock: 10,
    category: 'etc',
    options: []
  }
];

async function seedData() {
  try {
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    // 기존 데이터 삭제 (옵션부터 삭제해야 외래키 제약조건 때문에)
    console.log('기존 데이터 삭제 중...');
    await client.query('DELETE FROM order_item_options');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM options');
    await client.query('DELETE FROM menus');
    console.log('✅ 기존 데이터 삭제 완료');

    // 메뉴 및 옵션 삽입
    console.log('메뉴 및 옵션 데이터 삽입 중...');
    
    for (const menu of menus) {
      const menuResult = await client.query(
        `INSERT INTO menus (name, description, price, image, stock, category)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [menu.name, menu.description, menu.price, menu.image, menu.stock, menu.category]
      );
      const menuId = menuResult.rows[0].id;

      // 옵션 삽입
      for (const option of menu.options) {
        await client.query(
          `INSERT INTO options (name, price, menu_id)
           VALUES ($1, $2, $3)`,
          [option.name, option.price, menuId]
        );
      }
    }

    console.log('✅ 메뉴 및 옵션 데이터 삽입 완료');
    console.log(`\n✅ 총 ${menus.length}개의 메뉴와 옵션이 추가되었습니다.`);

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 데이터 시드 오류:');
    console.error(error.message);
    await client.end();
    process.exit(1);
  }
}

seedData();

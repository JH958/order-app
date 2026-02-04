// 데이터베이스 시드 유틸리티 (서버 시작 시 자동 실행)
import pool from '../config/database.js';

const menus = [
  // Coffee 메뉴
  {
    name: '아메리카노',
    description: '깔끔하고 진한 아메리카노',
    price: 4000,
    image: '아메리카노.png',
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
    image: '카페라떼.png',
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
    image: '카푸치노.png',
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
    image: '카페모카.png',
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
    image: '카라멜 마키아토.png',
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
    image: '바닐라 라떼.png',
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
    image: '자몽에이드.png',
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '레몬에이드',
    description: '시원한 레몬에이드',
    price: 5000,
    image: '레몬에이드.png',
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '밀크티',
    description: '부드러운 우유와 홍차의 만남',
    price: 5000,
    image: '밀크티.png',
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '청귤에이드',
    description: '달콤한 청귤에이드',
    price: 5500,
    image: '청귤에이드.png',
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '유자차',
    description: '따뜻한 유자차',
    price: 4500,
    image: '유자차.png',
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  {
    name: '생강차',
    description: '따뜻한 생강차',
    price: 4500,
    image: '생강차.png',
    stock: 10,
    category: 'non-coffee',
    options: []
  },
  // Etc 메뉴
  {
    name: '아이스크림',
    description: '부드러운 바닐라 아이스크림',
    price: 3000,
    image: '아이스크림.png',
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '크로와상',
    description: '바삭한 크로와상',
    price: 4000,
    image: '크로와상.png',
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '마카롱',
    description: '달콤한 마카롱',
    price: 2500,
    image: '마카롱.png',
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '베이글',
    description: '쫄깃한 베이글',
    price: 3500,
    image: '베이글.png',
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '머핀',
    description: '부드러운 머핀',
    price: 4000,
    image: '머핀.png',
    stock: 10,
    category: 'etc',
    options: []
  },
  {
    name: '쿠키',
    description: '달콤한 쿠키',
    price: 2000,
    image: '쿠키.png',
    stock: 10,
    category: 'etc',
    options: []
  }
];

/**
 * 메뉴 데이터가 없으면 자동으로 시드 데이터 추가
 * 기존 메뉴가 있으면 이미지만 업데이트
 */
export async function seedIfEmpty() {
  try {
    // 메뉴 개수 확인
    const countResult = await pool.query('SELECT COUNT(*) as count FROM menus');
    const count = parseInt(countResult.rows[0].count);
    
    const isFirstRun = count === 0;
    
    if (isFirstRun) {
      console.log('📦 메뉴 데이터가 없습니다. 초기 데이터를 추가합니다...');
    } else {
      console.log(`✅ 메뉴 데이터가 이미 존재합니다 (${count}개). 이미지 경로를 업데이트합니다...`);
    }
    
    // 메뉴 및 옵션 삽입/업데이트
    let insertedMenus = 0;
    let updatedMenus = 0;
    let insertedOptions = 0;
    
    for (const menu of menus) {
      try {
        // 메뉴 삽입 또는 업데이트 (이미지 포함)
        const menuResult = await pool.query(
          `INSERT INTO menus (name, description, price, image, stock, category)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (name) DO UPDATE SET
             image = EXCLUDED.image,
             description = EXCLUDED.description,
             price = EXCLUDED.price,
             stock = EXCLUDED.stock,
             category = EXCLUDED.category
           RETURNING id`,
          [menu.name, menu.description, menu.price, menu.image, menu.stock, menu.category]
        );
        
        const menuId = menuResult.rows[0].id;
        
        // 새로 삽입된 메뉴인지 확인
        if (isFirstRun) {
          insertedMenus++;
        } else {
          // 기존 메뉴인 경우 이미지 업데이트 확인
          const existingMenu = await pool.query(
            'SELECT image FROM menus WHERE id = $1',
            [menuId]
          );
          if (existingMenu.rows[0].image !== menu.image) {
            updatedMenus++;
          }
        }
        
        // 옵션 삽입
        for (const option of menu.options) {
          await pool.query(
            `INSERT INTO options (name, price, menu_id)
             VALUES ($1, $2, $3)
             ON CONFLICT DO NOTHING`,
            [option.name, option.price, menuId]
          );
          insertedOptions++;
        }
      } catch (error) {
        console.error(`⚠️  메뉴 "${menu.name}" 처리 중 오류:`, error.message);
        // 개별 메뉴 오류는 무시하고 계속 진행
      }
    }
    
    if (isFirstRun) {
      console.log(`✅ 초기 데이터 추가 완료: ${insertedMenus}개 메뉴, ${insertedOptions}개 옵션`);
    } else {
      console.log(`✅ 이미지 경로 업데이트 완료: ${updatedMenus}개 메뉴 업데이트됨`);
    }
  } catch (error) {
    console.error('❌ 데이터 시드 중 오류:', error.message);
    // 오류가 발생해도 서버는 계속 실행되도록 함
  }
}

// 메뉴 컨트롤러
import { Menu } from '../models/Menu.js';

export const getMenus = async (req, res, next) => {
  try {
    console.log('📋 메뉴 조회 요청 받음');
    const menus = await Menu.findAll();
    console.log(`✅ 메뉴 조회 성공: ${menus.length}개 메뉴 발견`);
    if (menus.length === 0) {
      console.warn('⚠️  메뉴 데이터가 비어있습니다. seed 스크립트를 실행해야 할 수 있습니다.');
    }
    res.json(menus);
  } catch (error) {
    console.error('❌ 메뉴 조회 오류:', error.message);
    console.error('오류 상세:', error);
    next(error);
  }
};

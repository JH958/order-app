// 재고 모델
import pool from '../config/database.js';

export const Inventory = {
  // 모든 재고 정보 조회
  async findAll() {
    const query = `
      SELECT 
        id as menu_id,
        name as menu_name,
        stock
      FROM menus
      ORDER BY id
    `;
    const result = await pool.query(query);
    // 프론트엔드에서 기대하는 필드명으로 변환
    return result.rows.map(row => ({
      menuId: row.menu_id,
      menuName: row.menu_name,
      stock: row.stock
    }));
  },

  // 특정 메뉴의 재고 조회
  async findByMenuId(menuId) {
    const query = `
      SELECT 
        id as menu_id,
        name as menu_name,
        stock
      FROM menus
      WHERE id = $1
    `;
    const result = await pool.query(query, [menuId]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      menuId: row.menu_id,
      menuName: row.menu_name,
      stock: row.stock
    };
  }
};

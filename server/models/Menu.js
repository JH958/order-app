// 메뉴 모델
import pool from '../config/database.js';

export const Menu = {
  // 모든 메뉴 조회 (옵션 포함)
  async findAll() {
    const query = `
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image,
        m.stock,
        m.category,
        m.created_at,
        m.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price,
              'menu_id', o.menu_id
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'::json
        ) as options
      FROM menus m
      LEFT JOIN (
        SELECT DISTINCT ON (menu_id, name) 
          id, name, price, menu_id
        FROM options
        ORDER BY menu_id, name, id
      ) o ON m.id = o.menu_id
      GROUP BY m.id
      ORDER BY m.id
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      ...row,
      options: row.options || []
    }));
  },

  // ID로 메뉴 조회
  async findById(id) {
    const query = `
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image,
        m.stock,
        m.category,
        m.created_at,
        m.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price,
              'menu_id', o.menu_id
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'::json
        ) as options
      FROM menus m
      LEFT JOIN (
        SELECT DISTINCT ON (menu_id, name) 
          id, name, price, menu_id
        FROM options
        ORDER BY menu_id, name, id
      ) o ON m.id = o.menu_id
      WHERE m.id = $1
      GROUP BY m.id
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      options: result.rows[0].options || []
    };
  },

  // 재고 업데이트
  async updateStock(id, stock) {
    const query = `
      UPDATE menus 
      SET stock = $1 
      WHERE id = $2
      RETURNING id, name, stock
    `;
    const result = await pool.query(query, [stock, id]);
    return result.rows[0];
  },

  // 재고 감소 (주문 시)
  async decreaseStock(id, quantity) {
    const query = `
      UPDATE menus 
      SET stock = stock - $1 
      WHERE id = $2 AND stock >= $1
      RETURNING id, name, stock
    `;
    const result = await pool.query(query, [quantity, id]);
    return result.rows[0];
  }
};

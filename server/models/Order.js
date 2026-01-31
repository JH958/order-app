// 주문 모델
import pool from '../config/database.js';

export const Order = {
  // 모든 주문 조회
  async findAll(status = null) {
    let query = `
      SELECT 
        o.id as order_id,
        o.order_time,
        o.total_amount,
        o.status,
        o.created_at,
        o.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'menuName', m.name,
              'quantity', oi.quantity,
              'itemPrice', oi.item_price,
              'totalPrice', oi.total_price,
              'selectedOptions', COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'name', opt.name,
                      'price', oio.option_price
                    )
                  )
                  FROM order_item_options oio
                  JOIN options opt ON oio.option_id = opt.id
                  WHERE oio.order_item_id = oi.id
                ),
                '[]'::json
              )
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
    `;

    const params = [];
    if (status) {
      query += ` WHERE o.status = $1`;
      params.push(status);
    }

    query += ` GROUP BY o.id ORDER BY o.order_time DESC`;

    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      orderId: row.order_id,
      orderTime: row.order_time,
      totalAmount: row.total_amount,
      status: row.status,
      items: row.items || []
    }));
  },

  // ID로 주문 조회
  async findById(id) {
    const query = `
      SELECT 
        o.id as order_id,
        o.order_time,
        o.total_amount,
        o.status,
        o.created_at,
        o.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'menuName', m.name,
              'quantity', oi.quantity,
              'itemPrice', oi.item_price,
              'totalPrice', oi.total_price,
              'selectedOptions', COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'name', opt.name,
                      'price', oio.option_price
                    )
                  )
                  FROM order_item_options oio
                  JOIN options opt ON oio.option_id = opt.id
                  WHERE oio.order_item_id = oi.id
                ),
                '[]'::json
              )
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE o.id = $1
      GROUP BY o.id
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return {
      orderId: result.rows[0].order_id,
      orderTime: result.rows[0].order_time,
      totalAmount: result.rows[0].total_amount,
      status: result.rows[0].status,
      items: result.rows[0].items || []
    };
  },

  // 주문 생성
  async create(orderData, client = null) {
    const dbClient = client || pool;
    const { items, totalAmount } = orderData;

    // 주문 생성
    const orderResult = await dbClient.query(
      `INSERT INTO orders (order_time, total_amount, status) 
       VALUES (CURRENT_TIMESTAMP, $1, '주문 접수') 
       RETURNING id, order_time, total_amount, status`,
      [totalAmount]
    );
    const order = orderResult.rows[0];

    // 주문 아이템 및 옵션 생성
    for (const item of items) {
      const { menuId, quantity, selectedOptions } = item;
      
      // 메뉴 정보 조회
      const menuResult = await dbClient.query(
        'SELECT price FROM menus WHERE id = $1',
        [menuId]
      );
      if (menuResult.rows.length === 0) {
        throw new Error(`메뉴를 찾을 수 없습니다: ${menuId}`);
      }
      const menuPrice = menuResult.rows[0].price;

      // 옵션 가격 합계
      const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      const itemPrice = menuPrice + optionsPrice;
      const totalPrice = itemPrice * quantity;

      // 주문 아이템 생성
      const itemResult = await dbClient.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, item_price, total_price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [order.id, menuId, quantity, itemPrice, totalPrice]
      );
      const orderItemId = itemResult.rows[0].id;

      // 주문 아이템 옵션 생성
      for (const option of selectedOptions) {
        await dbClient.query(
          `INSERT INTO order_item_options (order_item_id, option_id, option_price)
           VALUES ($1, $2, $3)`,
          [orderItemId, option.optionId, option.price]
        );
      }

      // 재고 감소
      await dbClient.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [quantity, menuId]
      );
    }

    return {
      orderId: order.id,
      orderTime: order.order_time,
      totalAmount: order.total_amount,
      status: order.status,
      items: items.map(item => ({
        menuName: item.menuName,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions
      }))
    };
  },

  // 주문 상태 업데이트
  async updateStatus(id, status) {
    const validStatuses = ['주문 접수', '제조 중', '제조 완료', '픽업 완료'];
    if (!validStatuses.includes(status)) {
      throw new Error('유효하지 않은 주문 상태입니다.');
    }

    // 현재 주문 상태 확인
    const currentOrder = await this.findById(id);
    if (!currentOrder) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    // 순차적 상태 변경 검증
    const statusOrder = ['주문 접수', '제조 중', '제조 완료', '픽업 완료'];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const newIndex = statusOrder.indexOf(status);

    if (newIndex <= currentIndex) {
      throw new Error('주문 상태는 순차적으로만 변경할 수 있습니다.');
    }

    const query = `
      UPDATE orders 
      SET status = $1 
      WHERE id = $2
      RETURNING id, order_time, total_amount, status
    `;
    const result = await pool.query(query, [status, id]);
    return this.findById(id);
  }
};

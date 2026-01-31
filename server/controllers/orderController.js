// 주문 컨트롤러
import pool from '../config/database.js';
import { Order } from '../models/Order.js';

export const createOrder = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { items, totalAmount } = req.body;

    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('주문 아이템이 필요합니다.');
    }

    if (!totalAmount || totalAmount < 0) {
      throw new Error('올바른 총 금액이 필요합니다.');
    }

    // 재고 확인 및 메뉴 ID 매핑
    const validatedItems = [];
    for (const item of items) {
      // 메뉴 ID가 있으면 직접 사용, 없으면 메뉴명으로 찾기
      let menu;
      if (item.menuId) {
        const menuResult = await client.query(
          'SELECT id, stock, price, name FROM menus WHERE id = $1',
          [item.menuId]
        );
        if (menuResult.rows.length === 0) {
          throw new Error(`메뉴를 찾을 수 없습니다: ID ${item.menuId}`);
        }
        menu = menuResult.rows[0];
      } else {
        // 하위 호환성을 위해 메뉴명으로도 찾기
        const menuResult = await client.query(
          'SELECT id, stock, price, name FROM menus WHERE name = $1',
          [item.menuName]
        );
        if (menuResult.rows.length === 0) {
          throw new Error(`메뉴를 찾을 수 없습니다: ${item.menuName}`);
        }
        menu = menuResult.rows[0];
      }

      // 재고 확인
      if (menu.stock < item.quantity) {
        throw new Error(`${item.menuName}의 재고가 부족합니다. (현재: ${menu.stock}개)`);
      }

      // 옵션 ID 매핑
      const selectedOptions = [];
      for (const option of item.selectedOptions || []) {
        const optionResult = await client.query(
          'SELECT id FROM options WHERE name = $1 AND menu_id = $2',
          [option.name, menu.id]
        );

        if (optionResult.rows.length === 0) {
          throw new Error(`옵션을 찾을 수 없습니다: ${option.name}`);
        }

        selectedOptions.push({
          optionId: optionResult.rows[0].id,
          name: option.name,
          price: option.price
        });
      }

      // 표시용 메뉴명 생성 (온도와 사이즈 포함)
      let displayMenuName = item.menuName;
      if (item.temperature || item.size) {
        const parts = [];
        if (item.temperature) parts.push(item.temperature);
        if (item.size) parts.push(item.size);
        displayMenuName = `${item.menuName}(${parts.join(', ')})`;
      }

      validatedItems.push({
        menuId: menu.id,
        menuName: displayMenuName, // 표시용 메뉴명 (온도, 사이즈 포함)
        quantity: item.quantity,
        selectedOptions
      });
    }

    // 주문 생성
    const orderData = {
      items: validatedItems,
      totalAmount
    };

    const order = await Order.create(orderData, client);

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const orders = await Order.findAll(status || null);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(parseInt(orderId));
    
    if (!order) {
      return res.status(404).json({
        error: true,
        message: '주문을 찾을 수 없습니다.',
        code: 'ORDER_NOT_FOUND'
      });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: true,
        message: '주문 상태가 필요합니다.',
        code: 'MISSING_STATUS'
      });
    }

    const order = await Order.updateStatus(parseInt(orderId), status);
    res.json(order);
  } catch (error) {
    if (error.message.includes('찾을 수 없습니다')) {
      return res.status(404).json({
        error: true,
        message: error.message,
        code: 'ORDER_NOT_FOUND'
      });
    }
    if (error.message.includes('유효하지 않은') || error.message.includes('순차적으로')) {
      return res.status(400).json({
        error: true,
        message: error.message,
        code: 'INVALID_STATUS'
      });
    }
    next(error);
  }
};

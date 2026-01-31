// 재고 컨트롤러
import { Inventory } from '../models/Inventory.js';
import { Menu } from '../models/Menu.js';

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findAll();
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock === null) {
      return res.status(400).json({
        error: true,
        message: '재고 수량이 필요합니다.',
        code: 'MISSING_STOCK'
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        error: true,
        message: '재고 수량은 0 이상이어야 합니다.',
        code: 'INVALID_STOCK'
      });
    }

    const updated = await Menu.updateStock(parseInt(menuId), stock);
    
    if (!updated) {
      return res.status(404).json({
        error: true,
        message: '메뉴를 찾을 수 없습니다.',
        code: 'MENU_NOT_FOUND'
      });
    }

    res.json({
      menuId: updated.id,
      menuName: updated.name,
      stock: updated.stock
    });
  } catch (error) {
    next(error);
  }
};

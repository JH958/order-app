// 재고 라우트
import express from 'express';
import {
  getInventory,
  updateInventory
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.put('/:menuId', updateInventory);

export default router;

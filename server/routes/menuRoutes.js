// 메뉴 라우트
import express from 'express';
import { getMenus } from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenus);

export default router;

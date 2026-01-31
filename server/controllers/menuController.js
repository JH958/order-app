// 메뉴 컨트롤러
import { Menu } from '../models/Menu.js';

export const getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (error) {
    next(error);
  }
};

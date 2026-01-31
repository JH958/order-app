// 대시보드 컨트롤러
import { Dashboard } from '../models/Dashboard.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await Dashboard.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

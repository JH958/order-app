// 대시보드 모델
import pool from '../config/database.js';

export const Dashboard = {
  // 통계 데이터 조회
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE true) as total_orders,
        COUNT(*) FILTER (WHERE status = '주문 접수') as pending_orders,
        COUNT(*) FILTER (WHERE status = '제조 중') as in_progress_orders,
        COUNT(*) FILTER (WHERE status = '제조 완료') as completed_orders,
        COUNT(*) FILTER (WHERE status = '픽업 완료') as picked_up_orders
      FROM orders
    `;
    const result = await pool.query(query);
    return {
      totalOrders: parseInt(result.rows[0].total_orders) || 0,
      pendingOrders: parseInt(result.rows[0].pending_orders) || 0,
      inProgressOrders: parseInt(result.rows[0].in_progress_orders) || 0,
      completedOrders: parseInt(result.rows[0].completed_orders) || 0,
      pickedUpOrders: parseInt(result.rows[0].picked_up_orders) || 0
    };
  }
};

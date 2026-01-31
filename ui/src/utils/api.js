// API 유틸리티
// Vite 프록시를 사용하므로 상대 경로 사용
const API_BASE_URL = '/api';

export const api = {
  // 메뉴 조회
  async getMenus() {
    const response = await fetch(`${API_BASE_URL}/menus`);
    if (!response.ok) {
      throw new Error('메뉴를 불러올 수 없습니다.');
    }
    return response.json();
  },

  // 주문 생성
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '주문 처리 중 오류가 발생했습니다.');
    }
    return response.json();
  },

  // 주문 목록 조회
  async getOrders(status = null) {
    const url = status 
      ? `${API_BASE_URL}/orders?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/orders`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('주문 정보를 불러올 수 없습니다.');
    }
    return response.json();
  },

  // 주문 상태 업데이트
  async updateOrderStatus(orderId, status) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '주문 상태 변경에 실패했습니다.');
    }
    return response.json();
  },

  // 재고 조회
  async getInventory() {
    const response = await fetch(`${API_BASE_URL}/inventory`);
    if (!response.ok) {
      throw new Error('재고 정보를 불러올 수 없습니다.');
    }
    return response.json();
  },

  // 재고 업데이트
  async updateInventory(menuId, stock) {
    const response = await fetch(`${API_BASE_URL}/inventory/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '재고 업데이트 중 오류가 발생했습니다.');
    }
    return response.json();
  },

  // 대시보드 통계 조회
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!response.ok) {
      throw new Error('통계 정보를 불러올 수 없습니다.');
    }
    return response.json();
  }
};

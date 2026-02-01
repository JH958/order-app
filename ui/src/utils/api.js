// API 유틸리티
// 프로덕션에서는 환경 변수 사용, 개발 환경에서는 프록시 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 디버깅을 위한 로깅
console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL);

export const api = {
  // 메뉴 조회
  async getMenus() {
    try {
      const url = `${API_BASE_URL}/menus`;
      console.log('Fetching menus from:', url);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`메뉴를 불러올 수 없습니다. (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Menus loaded:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      }
      throw error;
    }
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

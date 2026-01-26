// 주문 상태 상수
export const ORDER_STATUS = {
  PENDING: '주문 접수',
  IN_PROGRESS: '제조 중',
  COMPLETED: '제조 완료',
  PICKED_UP: '픽업 완료'
}

// 주문 상태 표시 텍스트 매핑
export const ORDER_STATUS_DISPLAY = {
  [ORDER_STATUS.PENDING]: '제조 시작',
  [ORDER_STATUS.IN_PROGRESS]: '제조 중',
  [ORDER_STATUS.COMPLETED]: '제조 완료',
  [ORDER_STATUS.PICKED_UP]: '픽업 완료'
}

// 필터 상태를 실제 상태 값으로 매핑
export const FILTER_STATUS_MAP = {
  '제조 시작': ORDER_STATUS.PENDING,
  '제조 중': ORDER_STATUS.IN_PROGRESS,
  '제조 완료': ORDER_STATUS.COMPLETED,
  '픽업 완료': ORDER_STATUS.PICKED_UP
}

// 다음 상태로의 전환 매핑
export const NEXT_STATUS_MAP = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.IN_PROGRESS,
  [ORDER_STATUS.IN_PROGRESS]: ORDER_STATUS.COMPLETED,
  [ORDER_STATUS.COMPLETED]: ORDER_STATUS.PICKED_UP,
  [ORDER_STATUS.PICKED_UP]: ORDER_STATUS.PICKED_UP
}

// 버튼 텍스트 매핑
export const STATUS_BUTTON_TEXT = {
  [ORDER_STATUS.PENDING]: '제조 시작',
  [ORDER_STATUS.IN_PROGRESS]: '제조 중',
  [ORDER_STATUS.COMPLETED]: '제조 완료',
  [ORDER_STATUS.PICKED_UP]: '픽업 완료'
}

// 버튼 CSS 클래스 매핑
export const STATUS_BUTTON_CLASS = {
  [ORDER_STATUS.PENDING]: 'status-btn pending',
  [ORDER_STATUS.IN_PROGRESS]: 'status-btn in-progress',
  [ORDER_STATUS.COMPLETED]: 'status-btn completed',
  [ORDER_STATUS.PICKED_UP]: 'status-btn finished'
}

// 수량 제한 상수
export const QUANTITY_LIMITS = {
  MIN: 1,
  MAX: 99
}

import { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FILTER_STATUS_MAP, ORDER_STATUS, NEXT_STATUS_MAP, STATUS_BUTTON_TEXT, STATUS_BUTTON_CLASS } from '../constants/orderConstants'
import './OrderStatus.css'

// 순수 함수는 컴포넌트 외부로 이동
const getDisplayStatus = (status) => {
  const statusDisplayMap = {
    [ORDER_STATUS.PENDING]: '제조 시작',
    [ORDER_STATUS.IN_PROGRESS]: '제조 중',
    [ORDER_STATUS.COMPLETED]: '제조 완료',
    [ORDER_STATUS.PICKED_UP]: '픽업 완료'
  }
  return statusDisplayMap[status] || status
}

const getNextStatus = (currentStatus) => {
  return NEXT_STATUS_MAP[currentStatus] || currentStatus
}

const getStatusButtonText = (status) => {
  return STATUS_BUTTON_TEXT[status] || '픽업 완료'
}

const getStatusButtonClass = (status) => {
  return STATUS_BUTTON_CLASS[status] || 'status-btn finished'
}

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const [filterStatus, setFilterStatus] = useState('전체')

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }, [])

  const formatOrderItems = useCallback((items) => {
    return items.map(item => {
      const options = item.selectedOptions && item.selectedOptions.length > 0
        ? ` (${item.selectedOptions.map(opt => opt.name).join(', ')})`
        : ''
      return `${item.menuName}${options} x ${item.quantity}`
    }).join(', ')
  }, [])

  const handleStatusChange = useCallback((orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    if (nextStatus !== currentStatus) {
      onUpdateOrderStatus(orderId, nextStatus)
    }
  }, [onUpdateOrderStatus])

  // 필터링된 주문 목록을 useMemo로 메모이제이션
  const filteredOrders = useMemo(() => {
    if (filterStatus === '전체') return orders
    
    const targetStatus = FILTER_STATUS_MAP[filterStatus]
    if (!targetStatus) return orders
    
    return orders.filter(order => order.status === targetStatus)
  }, [orders, filterStatus])

  return (
    <div className="order-status">
      <div className="order-status-header">
        <h2 className="order-status-title">주문 현황</h2>
        <select
          className="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="주문 상태 필터"
        >
          <option value="전체">전체</option>
          <option value="제조 시작">제조 시작</option>
          <option value="제조 중">제조 중</option>
          <option value="제조 완료">제조 완료</option>
          <option value="픽업 완료">픽업 완료</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <p className="empty-orders">주문이 없습니다.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="order-item">
              <div className="order-info">
                <div className="order-time">{formatDate(order.orderTime)}</div>
                <div className="order-details">
                  <span className="order-items">{formatOrderItems(order.items)}</span>
                  <span className="order-amount">{order.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <button
                className={getStatusButtonClass(order.status)}
                onClick={() => handleStatusChange(order.orderId, order.status)}
                disabled={order.status === ORDER_STATUS.PICKED_UP}
                aria-label={`${getStatusButtonText(order.status)} 버튼`}
              >
                {getStatusButtonText(order.status)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

OrderStatus.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      orderId: PropTypes.number.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          menuName: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          selectedOptions: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string.isRequired,
              price: PropTypes.number.isRequired
            })
          )
        })
      ).isRequired,
      totalAmount: PropTypes.number.isRequired,
      orderTime: PropTypes.string.isRequired,
      status: PropTypes.oneOf([
        ORDER_STATUS.PENDING,
        ORDER_STATUS.IN_PROGRESS,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.PICKED_UP
      ]).isRequired
    })
  ).isRequired,
  onUpdateOrderStatus: PropTypes.func.isRequired
}

export default OrderStatus

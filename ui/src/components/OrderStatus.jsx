import { useState } from 'react'
import './OrderStatus.css'

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const [filterStatus, setFilterStatus] = useState('전체')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  const formatOrderItems = (items) => {
    return items.map(item => {
      const options = item.selectedOptions && item.selectedOptions.length > 0
        ? ` (${item.selectedOptions.map(opt => opt.name).join(', ')})`
        : ''
      return `${item.menuName}${options} x ${item.quantity}`
    }).join(', ')
  }

  const getDisplayStatus = (status) => {
    if (status === '주문 접수') return '제조 시작'
    if (status === '제조 중') return '제조 중'
    if (status === '제조 완료') return '제조 완료'
    if (status === '픽업 완료') return '픽업 완료'
    return status
  }

  const getNextStatus = (currentStatus) => {
    if (currentStatus === '주문 접수') return '제조 중'
    if (currentStatus === '제조 중') return '제조 완료'
    if (currentStatus === '제조 완료') return '픽업 완료'
    return currentStatus
  }

  const getStatusButtonText = (status) => {
    if (status === '주문 접수') return '제조 시작'
    if (status === '제조 중') return '제조 중'
    if (status === '제조 완료') return '제조 완료'
    return '픽업 완료'
  }

  const getStatusButtonClass = (status) => {
    if (status === '주문 접수') return 'status-btn pending'
    if (status === '제조 중') return 'status-btn in-progress'
    if (status === '제조 완료') return 'status-btn completed'
    return 'status-btn finished'
  }

  const getStatusDisplayClass = (status) => {
    if (status === '주문 접수') return 'status-display pending'
    if (status === '제조 중') return 'status-display in-progress'
    if (status === '제조 완료') return 'status-display completed'
    return 'status-display finished'
  }

  const handleStatusChange = (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    if (nextStatus !== currentStatus) {
      onUpdateOrderStatus(orderId, nextStatus)
    }
  }

  const getFilteredOrders = () => {
    if (filterStatus === '전체') return orders
    
    // 필터 상태를 실제 상태 값으로 매핑
    const statusMap = {
      '제조 시작': '주문 접수',
      '제조 중': '제조 중',
      '제조 완료': '제조 완료',
      '픽업 완료': '픽업 완료'
    }
    
    const targetStatus = statusMap[filterStatus]
    return orders.filter(order => order.status === targetStatus)
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="order-status">
      <div className="order-status-header">
        <h2 className="order-status-title">주문 현황</h2>
        <select
          className="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
                disabled={order.status === '픽업 완료'}
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

export default OrderStatus

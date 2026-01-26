import { useState } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import InventoryStatus from '../components/InventoryStatus'
import OrderStatus from '../components/OrderStatus'
import { ORDER_STATUS } from '../constants/orderConstants'
import './AdminPage.css'

// 임시 재고 데이터
const initialInventory = [
  { menuId: 1, menuName: '아메리카노 (ICE)', stock: 10 },
  { menuId: 2, menuName: '아메리카노 (HOT)', stock: 10 },
  { menuId: 3, menuName: '카페라떼', stock: 10 }
]

function AdminPage({ onNavigate, orders = [], onUpdateOrderStatus = () => {} }) {
  const [inventory, setInventory] = useState(initialInventory)

  // 대시보드 통계 계산
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === ORDER_STATUS.PENDING).length,
    inProgressOrders: orders.filter(order => order.status === ORDER_STATUS.IN_PROGRESS).length,
    completedOrders: orders.filter(order => order.status === ORDER_STATUS.COMPLETED).length
  }

  const handleUpdateStock = (menuId, newStock) => {
    try {
      setInventory(prev => 
        prev.map(item => 
          item.menuId === menuId 
            ? { ...item, stock: Math.max(0, newStock) }
            : item
        )
      )
    } catch (error) {
      console.error('재고 업데이트 중 오류 발생:', error)
    }
  }

  return (
    <div className="admin-page">
      <Header currentPage="admin" onNavigate={onNavigate} />
      <main className="admin-content">
        <Dashboard stats={stats} />
        <InventoryStatus 
          inventory={inventory} 
          onUpdateStock={handleUpdateStock}
        />
        <OrderStatus 
          orders={orders} 
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      </main>
    </div>
  )
}

AdminPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      orderId: PropTypes.number.isRequired,
      items: PropTypes.array.isRequired,
      totalAmount: PropTypes.number.isRequired,
      orderTime: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ),
  onUpdateOrderStatus: PropTypes.func
}

export default AdminPage

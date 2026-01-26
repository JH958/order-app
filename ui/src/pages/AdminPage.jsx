import { useState } from 'react'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import InventoryStatus from '../components/InventoryStatus'
import OrderStatus from '../components/OrderStatus'
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
    pendingOrders: orders.filter(order => order.status === '주문 접수').length,
    inProgressOrders: orders.filter(order => order.status === '제조 중').length,
    completedOrders: orders.filter(order => order.status === '제조 완료').length
  }

  const handleUpdateStock = (menuId, newStock) => {
    setInventory(prev => 
      prev.map(item => 
        item.menuId === menuId 
          ? { ...item, stock: Math.max(0, newStock) }
          : item
      )
    )
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

export default AdminPage

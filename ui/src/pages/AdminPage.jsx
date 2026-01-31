import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import InventoryStatus from '../components/InventoryStatus'
import OrderStatus from '../components/OrderStatus'
import { ORDER_STATUS } from '../constants/orderConstants'
import { api } from '../utils/api'
import './AdminPage.css'

function AdminPage({ onNavigate, orders = [], onUpdateOrderStatus = () => {} }) {
  const [inventory, setInventory] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    pickedUpOrders: 0
  })
  const [loading, setLoading] = useState(true)

  // 재고 및 통계 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [inventoryData, statsData] = await Promise.all([
          api.getInventory(),
          api.getDashboardStats()
        ])
        setInventory(inventoryData)
        setStats(statsData)
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // 주문 목록도 로드하여 App 컴포넌트와 동기화
    const loadOrders = async () => {
      try {
        const ordersData = await api.getOrders()
        // App 컴포넌트의 orders 상태를 업데이트하기 위해
        // 부모 컴포넌트에 전달할 수 있는 콜백이 필요하지만
        // 현재 구조에서는 orders prop으로 받고 있으므로
        // 주기적으로 새로고침하는 방식 사용
      } catch (error) {
        console.error('주문 로딩 중 오류 발생:', error)
      }
    }
    loadOrders()

    // 주기적으로 데이터 새로고침 (5초마다)
    const interval = setInterval(() => {
      loadData()
      loadOrders()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleUpdateStock = async (menuId, newStock) => {
    try {
      const updated = await api.updateInventory(menuId, newStock)
      setInventory(prev => 
        prev.map(item => 
          item.menuId === menuId 
            ? updated
            : item
        )
      )
    } catch (error) {
      console.error('재고 업데이트 중 오류 발생:', error)
      throw error
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      // 로컬 상태도 업데이트
      onUpdateOrderStatus(orderId, newStatus)
      // 통계 새로고침
      const statsData = await api.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error('주문 상태 업데이트 중 오류 발생:', error)
      throw error
    }
  }

  return (
    <div className="admin-page">
      <Header currentPage="admin" onNavigate={onNavigate} />
      <main className="admin-content">
        {loading ? (
          <div className="loading">데이터를 불러오는 중...</div>
        ) : (
          <>
            <Dashboard stats={stats} />
            <OrderStatus 
              orders={orders} 
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
            <InventoryStatus 
              inventory={inventory} 
              onUpdateStock={handleUpdateStock}
            />
          </>
        )}
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

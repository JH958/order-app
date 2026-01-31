import { useState, useEffect } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import ErrorBoundary from './components/ErrorBoundary'
import { ORDER_STATUS } from './constants/orderConstants'
import { api } from './utils/api'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [orders, setOrders] = useState([])

  // 주문 목록 로드
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await api.getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error('주문 목록 로딩 중 오류 발생:', error)
      }
    }
    loadOrders()

    // 관리자 페이지일 때 주기적으로 새로고침 (5초마다)
    if (currentPage === 'admin') {
      const interval = setInterval(loadOrders, 5000)
      return () => clearInterval(interval)
    }
  }, [currentPage])

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleCreateOrder = async (orderData) => {
    try {
      // API에서 이미 주문이 생성되었으므로 주문 목록 새로고침
      const ordersData = await api.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('주문 목록 새로고침 중 오류 발생:', error)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // API에서 이미 상태가 업데이트되었으므로 주문 목록 새로고침
      const ordersData = await api.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('주문 목록 새로고침 중 오류 발생:', error)
    }
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {currentPage === 'order' && (
          <OrderPage 
            onNavigate={handleNavigate} 
            onCreateOrder={handleCreateOrder}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPage 
            onNavigate={handleNavigate}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App

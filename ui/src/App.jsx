import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import ErrorBoundary from './components/ErrorBoundary'
import { ORDER_STATUS } from './constants/orderConstants'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [orders, setOrders] = useState([])
  const [nextOrderId, setNextOrderId] = useState(1)

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleCreateOrder = (orderData) => {
    try {
      const newOrder = {
        orderId: nextOrderId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        orderTime: orderData.orderTime,
        status: ORDER_STATUS.PENDING
      }
      setOrders(prev => [newOrder, ...prev]) // 최신 주문이 위에 오도록
      setNextOrderId(prev => prev + 1)
    } catch (error) {
      console.error('주문 생성 중 오류 발생:', error)
      throw error
    }
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.orderId === orderId
            ? { ...order, status: newStatus }
            : order
        )
      )
    } catch (error) {
      console.error('주문 상태 업데이트 중 오류 발생:', error)
      throw error
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

import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [orders, setOrders] = useState([])
  const [nextOrderId, setNextOrderId] = useState(1)

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleCreateOrder = (orderData) => {
    const newOrder = {
      orderId: nextOrderId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      orderTime: orderData.orderTime,
      status: '주문 접수'
    }
    setOrders(prev => [newOrder, ...prev]) // 최신 주문이 위에 오도록
    setNextOrderId(prev => prev + 1)
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? { ...order, status: newStatus }
          : order
      )
    )
  }

  return (
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
  )
}

export default App

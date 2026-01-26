import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="App">
      {currentPage === 'order' && <OrderPage onNavigate={handleNavigate} />}
      {currentPage === 'admin' && (
        <div className="admin-placeholder">
          <h1>관리자 화면</h1>
          <p>관리자 화면은 추후 구현 예정입니다.</p>
          <button onClick={() => handleNavigate('order')}>주문하기로 돌아가기</button>
        </div>
      )}
    </div>
  )
}

export default App

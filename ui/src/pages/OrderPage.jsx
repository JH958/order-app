import { useState, useEffect } from 'react'
import Header from '../components/Header'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import './OrderPage.css'

// 임시 메뉴 데이터
const mockMenus = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    image: null,
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    image: null,
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    image: null,
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '에스프레소와 스팀 우유, 거품의 완벽한 조합',
    image: null,
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '카라멜 마키아토',
    price: 5500,
    description: '달콤한 카라멜과 에스프레소의 만남',
    image: null,
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 6,
    name: '바닐라 라떼',
    price: 5500,
    description: '부드러운 바닐라 향이 가득한 라떼',
    image: null,
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  }
]

function OrderPage({ onNavigate }) {
  const [menus, setMenus] = useState([])
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    // 임시로 mockMenus 사용 (나중에 API로 교체)
    setMenus(mockMenus)
  }, [])

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      // 같은 메뉴와 옵션 조합이 있는지 확인
      const existingIndex = prev.findIndex(cartItem => 
        cartItem.menuId === item.menuId &&
        JSON.stringify(cartItem.selectedOptions.map(opt => opt.name).sort()) === 
        JSON.stringify(item.selectedOptions.map(opt => opt.name).sort())
      )

      if (existingIndex !== -1) {
        // 기존 아이템 수량 증가
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      } else {
        // 새 아이템 추가
        return [...prev, item]
      }
    })
  }

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    // 주문 처리 (나중에 API로 교체)
    const orderData = {
      items: cartItems,
      totalAmount: cartItems.reduce((total, item) => {
        const itemPrice = item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
        return total + (itemPrice * item.quantity)
      }, 0),
      orderTime: new Date().toISOString()
    }

    console.log('주문 데이터:', orderData)
    alert('주문이 완료되었습니다!')
    
    // 장바구니 초기화
    setCartItems([])
  }

  return (
    <div className="order-page">
      <Header currentPage="order" onNavigate={onNavigate} />
      <main className="order-content">
        <div className="menu-section">
          <div className="menu-grid">
            {menus.map(menu => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
        <div className="cart-section">
          <ShoppingCart cartItems={cartItems} onOrder={handleOrder} />
        </div>
      </main>
    </div>
  )
}

export default OrderPage

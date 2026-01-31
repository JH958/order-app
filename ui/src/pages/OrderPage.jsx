import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/Header'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import Toast from '../components/Toast'
import useToast from '../hooks/useToast'
import { QUANTITY_LIMITS } from '../constants/orderConstants'
import { api } from '../utils/api'
import './OrderPage.css'

function OrderPage({ onNavigate, onCreateOrder }) {
  const [allMenus, setAllMenus] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [nextCartItemId, setNextCartItemId] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('coffee')
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    // API에서 모든 메뉴 데이터 로드
    const loadMenus = async () => {
      try {
        setLoading(true)
        const menuData = await api.getMenus()
        // 메뉴명에서 (ICE), (HOT) 제거
        const processedMenus = menuData.map(menu => {
          const nameWithoutTemp = menu.name.replace(/\s*\(ICE\)|\s*\(HOT\)/gi, '').trim()
          return {
            ...menu,
            name: nameWithoutTemp,
            category: menu.category || 'coffee' // category가 없으면 기본값 'coffee'
          }
        })
        setAllMenus(processedMenus)
      } catch (error) {
        console.error('메뉴 로딩 중 오류 발생:', error)
        showToast(error.message || '메뉴를 불러오는 중 오류가 발생했습니다.', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadMenus()
  }, [showToast])

  // 활성 탭에 따른 메뉴 필터링
  const displayedMenus = useMemo(() => {
    return allMenus.filter(menu => {
      switch (activeTab) {
        case 'coffee':
          return menu.category === 'coffee'
        case 'non-coffee':
          return menu.category === 'non-coffee'
        case 'etc':
          return menu.category === 'etc'
        default:
          return menu.category === 'coffee'
      }
    })
  }, [activeTab, allMenus])

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      // 같은 메뉴와 옵션 조합이 있는지 확인 (ICE/HOT, 사이즈 포함)
      const existingIndex = prev.findIndex(cartItem => 
        cartItem.menuId === item.menuId &&
        cartItem.temperature === item.temperature &&
        cartItem.size === item.size &&
        JSON.stringify(cartItem.selectedOptions.map(opt => opt.name).sort()) === 
        JSON.stringify(item.selectedOptions.map(opt => opt.name).sort())
      )

      if (existingIndex !== -1) {
        // 기존 아이템 수량 증가
        const updated = [...prev]
        if (!updated[existingIndex].cartItemId) {
          updated[existingIndex].cartItemId = nextCartItemId
          setNextCartItemId(prev => prev + 1)
        }
        updated[existingIndex].quantity += 1
        return updated
      } else {
        // 새 아이템 추가 (고유 ID 부여)
        const newId = nextCartItemId
        setNextCartItemId(prev => prev + 1)
        return [...prev, { ...item, cartItemId: newId }]
      }
    })
  }

  const handleRemoveFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(cartItemId)
      return
    }
    
    const MAX_QUANTITY = QUANTITY_LIMITS.MAX
    const validatedQuantity = Math.min(newQuantity, MAX_QUANTITY)
    
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: validatedQuantity }
          : item
      )
    )
  }

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      showToast('장바구니가 비어있습니다.', 'warning')
      return
    }

    try {
      // 주문 데이터 생성
      const totalAmount = cartItems.reduce((total, item) => {
        const itemPrice = item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
        return total + (itemPrice * item.quantity)
      }, 0)

      const orderData = {
        items: cartItems.map(item => ({
          menuId: item.menuId, // 메뉴 ID 직접 전송 (더 안전함)
          menuName: item.menuName, // 원본 메뉴명 (표시용)
          temperature: item.temperature || null,
          size: item.size || null,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        })),
        totalAmount: totalAmount
      }

      // API로 주문 생성
      const createdOrder = await api.createOrder(orderData)
      
      onCreateOrder({
        ...createdOrder,
        orderTime: createdOrder.orderTime || new Date().toISOString()
      })
      
      showToast('주문이 완료되었습니다!', 'success')
      setCartItems([])
    } catch (error) {
      console.error('주문 처리 중 오류 발생:', error)
      showToast(error.message || '주문 처리 중 오류가 발생했습니다.', 'error')
    }
  }

  return (
    <div className="order-page">
      <Header currentPage="order" onNavigate={onNavigate} />
      <div className="menu-tabs">
        <button
          className={`menu-tab ${activeTab === 'coffee' ? 'active' : ''}`}
          onClick={() => setActiveTab('coffee')}
        >
          Coffee
        </button>
        <button
          className={`menu-tab ${activeTab === 'non-coffee' ? 'active' : ''}`}
          onClick={() => setActiveTab('non-coffee')}
        >
          Non-coffee
        </button>
        <button
          className={`menu-tab ${activeTab === 'etc' ? 'active' : ''}`}
          onClick={() => setActiveTab('etc')}
        >
          Etc
        </button>
      </div>
      <main className="order-content">
        <div className="menu-section">
          {loading ? (
            <div className="loading">메뉴를 불러오는 중...</div>
          ) : displayedMenus.length === 0 ? (
            <div className="loading">해당 카테고리의 메뉴가 없습니다.</div>
          ) : (
            <div className="menu-grid">
              {displayedMenus.map(menu => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
        <div className="cart-section">
          <ShoppingCart 
            cartItems={cartItems} 
            onOrder={handleOrder}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onShowToast={showToast}
          />
        </div>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </div>
  )
}

OrderPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onCreateOrder: PropTypes.func.isRequired
}

export default OrderPage

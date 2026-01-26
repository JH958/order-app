import { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { QUANTITY_LIMITS } from '../constants/orderConstants'
import './ShoppingCart.css'

const MAX_QUANTITY = QUANTITY_LIMITS.MAX
const MIN_QUANTITY = QUANTITY_LIMITS.MIN

function ShoppingCart({ cartItems, onOrder, onRemoveItem, onUpdateQuantity, onShowToast }) {
  // 총 금액 계산을 useMemo로 메모이제이션
  const calculateTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
      return total + (itemPrice * item.quantity)
    }, 0)
  }, [cartItems])

  const formatOptions = useCallback((options) => {
    if (options.length === 0) return ''
    return ` (${options.map(opt => opt.name).join(', ')})`
  }, [])

  const handleOrder = useCallback(() => {
    if (cartItems.length === 0) {
      if (onShowToast) {
        onShowToast('장바구니가 비어있습니다.', 'warning')
      }
      return
    }
    onOrder()
  }, [cartItems.length, onOrder, onShowToast])

  const handleQuantityChange = useCallback((cartItemId, delta) => {
    const item = cartItems.find(item => item.cartItemId === cartItemId)
    if (item) {
      const newQuantity = item.quantity + delta
      // 최대값 제한
      if (newQuantity > MAX_QUANTITY) {
        if (onShowToast) {
          onShowToast(`최대 ${MAX_QUANTITY}개까지 주문 가능합니다.`, 'warning')
        }
        return
      }
      if (onUpdateQuantity) {
        onUpdateQuantity(cartItemId, newQuantity)
      }
    }
  }, [cartItems, onUpdateQuantity, onShowToast])

  const handleQuantityInput = useCallback((cartItemId, value) => {
    // 빈 값이면 현재 값 유지 (입력 중일 수 있으므로)
    if (value === '' || value === null || value === undefined) {
      return
    }

    // 숫자가 아닌 값 제거
    const numValue = parseInt(value, 10)
    
    // NaN이거나 유효하지 않은 숫자인 경우 무시
    if (isNaN(numValue)) {
      return
    }

    // 최소값 검증 (0 이하면 삭제)
    if (numValue < MIN_QUANTITY) {
      if (onUpdateQuantity) {
        onUpdateQuantity(cartItemId, MIN_QUANTITY)
      }
      if (onShowToast) {
        onShowToast(`최소 ${MIN_QUANTITY}개 이상 입력해주세요.`, 'warning')
      }
      return
    }

    // 최대값 검증
    if (numValue > MAX_QUANTITY) {
      if (onUpdateQuantity) {
        onUpdateQuantity(cartItemId, MAX_QUANTITY)
      }
      if (onShowToast) {
        onShowToast(`최대 ${MAX_QUANTITY}개까지 주문 가능합니다.`, 'warning')
      }
      return
    }

    // 유효한 값이면 업데이트
    if (onUpdateQuantity) {
      onUpdateQuantity(cartItemId, numValue)
    }
  }, [onUpdateQuantity, onShowToast])

  return (
    <div className="shopping-cart">
      <h2 className="cart-title">장바구니</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">장바구니가 비어있습니다.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cartItems.map((item) => {
                const itemPrice = item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
                const totalPrice = itemPrice * item.quantity
                return (
                  <div key={item.cartItemId || item.menuId} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.menuName}{formatOptions(item.selectedOptions)}</span>
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn decrease-btn"
                          onClick={() => handleQuantityChange(item.cartItemId || item.menuId, -1)}
                          aria-label={`${item.menuName} 수량 감소`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          min={MIN_QUANTITY}
                          max={MAX_QUANTITY}
                          onChange={(e) => handleQuantityInput(item.cartItemId || item.menuId, e.target.value)}
                          onBlur={(e) => {
                            // 포커스가 벗어날 때 빈 값이면 최소값으로 설정
                            if (e.target.value === '' || parseInt(e.target.value) < MIN_QUANTITY) {
                              if (onUpdateQuantity) {
                                onUpdateQuantity(item.cartItemId || item.menuId, MIN_QUANTITY)
                              }
                            }
                          }}
                          aria-label={`${item.menuName} 수량`}
                        />
                        <button 
                          className="quantity-btn increase-btn"
                          onClick={() => handleQuantityChange(item.cartItemId || item.menuId, 1)}
                          aria-label={`${item.menuName} 수량 증가`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-actions">
                      <span className="item-price">{totalPrice.toLocaleString()}원</span>
                      <button 
                        className="remove-btn"
                        onClick={() => onRemoveItem && onRemoveItem(item.cartItemId || item.menuId)}
                        title="삭제"
                        aria-label={`${item.menuName} 삭제`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="cart-summary-section">
            <div className="cart-total">
              <span className="total-label">총 금액</span>
              <span className="total-amount">{calculateTotal.toLocaleString()}원</span>
            </div>
            <button className="order-btn" onClick={handleOrder} aria-label="주문하기">
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

ShoppingCart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      cartItemId: PropTypes.number,
      menuId: PropTypes.number.isRequired,
      menuName: PropTypes.string.isRequired,
      basePrice: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      selectedOptions: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  onOrder: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func,
  onUpdateQuantity: PropTypes.func,
  onShowToast: PropTypes.func
}

export default ShoppingCart

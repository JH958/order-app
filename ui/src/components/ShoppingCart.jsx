import './ShoppingCart.css'

function ShoppingCart({ cartItems, onOrder, onRemoveItem, onUpdateQuantity }) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
      return total + (itemPrice * item.quantity)
    }, 0)
  }

  const formatOptions = (options) => {
    if (options.length === 0) return ''
    return ` (${options.map(opt => opt.name).join(', ')})`
  }

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    onOrder()
  }

  const handleQuantityChange = (cartItemId, delta) => {
    const item = cartItems.find(item => item.cartItemId === cartItemId)
    if (item) {
      const newQuantity = item.quantity + delta
      if (onUpdateQuantity) {
        onUpdateQuantity(cartItemId, newQuantity)
      }
    }
  }

  const handleQuantityInput = (cartItemId, value) => {
    const numValue = parseInt(value) || 0
    if (onUpdateQuantity) {
      onUpdateQuantity(cartItemId, numValue)
    }
  }

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
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleQuantityInput(item.cartItemId || item.menuId, e.target.value)}
                        />
                        <button 
                          className="quantity-btn increase-btn"
                          onClick={() => handleQuantityChange(item.cartItemId || item.menuId, 1)}
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
              <span className="total-amount">{calculateTotal().toLocaleString()}원</span>
            </div>
            <button className="order-btn" onClick={handleOrder}>
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingCart

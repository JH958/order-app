import './ShoppingCart.css'

function ShoppingCart({ cartItems, onOrder }) {
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

  return (
    <div className="shopping-cart">
      <h2 className="cart-title">장바구니</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">장바구니가 비어있습니다.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cartItems.map((item, index) => {
                const itemPrice = item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
                const totalPrice = itemPrice * item.quantity
                return (
                  <div key={index} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.menuName}{formatOptions(item.selectedOptions)}</span>
                      <span className="item-quantity">X {item.quantity}</span>
                    </div>
                    <span className="item-price">{totalPrice.toLocaleString()}원</span>
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

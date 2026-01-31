import './InventoryStatus.css'
import PropTypes from 'prop-types'

function InventoryStatus({ inventory, onUpdateStock }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'status-out' }
    if (stock < 5) return { text: '주의', className: 'status-warning' }
    return { text: '정상', className: 'status-normal' }
  }

  const handleIncrease = (menuId) => {
    const item = inventory.find(inv => inv.menuId === menuId)
    if (item) {
      onUpdateStock(menuId, item.stock + 1)
    }
  }

  const handleDecrease = (menuId) => {
    const item = inventory.find(inv => inv.menuId === menuId)
    if (item && item.stock > 0) {
      onUpdateStock(menuId, item.stock - 1)
    }
  }

  return (
    <div className="inventory-status">
      <h2 className="inventory-title">재고 현황</h2>
      <div className="inventory-container">
        <div className="inventory-grid">
          {inventory.map((item) => {
            const status = getStockStatus(item.stock)
            return (
              <div key={item.menuId} className="inventory-card">
                <h3 className="inventory-menu-name">{item.menuName}</h3>
                <div className="inventory-stock">
                  <span className="stock-quantity">{item.stock}개</span>
                  <span className={`stock-status ${status.className}`} aria-label={`재고 상태: ${status.text}`}>
                    {status.text}
                  </span>
                </div>
                <div className="inventory-controls">
                  <button
                    className="stock-btn decrease-btn"
                    onClick={() => handleDecrease(item.menuId)}
                    disabled={item.stock === 0}
                    aria-label={`${item.menuName} 재고 감소`}
                  >
                    -
                  </button>
                  <button
                    className="stock-btn increase-btn"
                    onClick={() => handleIncrease(item.menuId)}
                    aria-label={`${item.menuName} 재고 증가`}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

InventoryStatus.propTypes = {
  inventory: PropTypes.arrayOf(
    PropTypes.shape({
      menuId: PropTypes.number.isRequired,
      menuName: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired
    })
  ).isRequired,
  onUpdateStock: PropTypes.func.isRequired
}

export default InventoryStatus

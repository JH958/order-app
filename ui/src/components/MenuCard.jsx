import { useState } from 'react'
import './MenuCard.css'

function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleOptionToggle = (option) => {
    setSelectedOptions(prev => {
      const isSelected = prev.some(opt => opt.name === option.name)
      if (isSelected) {
        return prev.filter(opt => opt.name !== option.name)
      } else {
        return [...prev, option]
      }
    })
  }

  const handleAddToCart = () => {
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      selectedOptions: selectedOptions,
      quantity: 1
    })
    // 옵션 초기화
    setSelectedOptions([])
  }

  const calculateItemPrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    return menu.price + optionsPrice
  }

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} />
        ) : (
          <div className="image-placeholder">
            <span>이미지</span>
          </div>
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
      </div>
      <div className="menu-options">
        {menu.options.map((option) => (
          <label key={option.name} className="option-checkbox">
            <input
              type="checkbox"
              checked={selectedOptions.some(opt => opt.name === option.name)}
              onChange={() => handleOptionToggle(option)}
            />
            <span>
              {option.name} ({option.price > 0 ? `+${option.price.toLocaleString()}원` : '+0원'})
            </span>
          </label>
        ))}
      </div>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        담기
      </button>
    </div>
  )
}

export default MenuCard

import { useState } from 'react'
import PropTypes from 'prop-types'
import './MenuCard.css'

function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [temperature, setTemperature] = useState(null) // ICE 또는 HOT
  const [size, setSize] = useState('M') // S, M, L

  // 커피 메뉴인지 확인 (category가 coffee이거나 options가 있는 경우)
  const isCoffee = menu.category === 'coffee' || (menu.options && menu.options.length > 0)
  // Non-coffee 메뉴인지 확인
  const isNonCoffee = menu.category === 'non-coffee'

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

  const handleTemperatureChange = (temp) => {
    setTemperature(temp === temperature ? null : temp)
  }

  const handleSizeChange = (newSize) => {
    setSize(newSize)
  }

  const handleAddToCart = () => {
    // 커피 메뉴는 ICE/HOT 선택 필수
    if (isCoffee && !temperature) {
      return
    }
    // Non-coffee 메뉴도 ICE/HOT 선택 필수
    if (isNonCoffee && !temperature) {
      return
    }

    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      selectedOptions: selectedOptions,
      temperature: temperature,
      size: size,
      quantity: 1
    })
    // 옵션 및 온도 초기화
    setSelectedOptions([])
    setTemperature(null)
    setSize('M')
  }

  const calculateItemPrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    return menu.price + optionsPrice
  }

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.image ? (
          <img src={`/images/${menu.image}`} alt={menu.name} />
        ) : (
          <div className="image-placeholder">
            <span>이미지</span>
          </div>
        )}
      </div>
      {(isCoffee || isNonCoffee) && (
        <div className="temperature-selector">
          <label className={`temp-option ${temperature === 'ICE' ? 'active' : ''}`}>
            <input
              type="radio"
              name={`temp-${menu.id}`}
              checked={temperature === 'ICE'}
              onChange={() => handleTemperatureChange('ICE')}
            />
            <span>ICE</span>
          </label>
          <label className={`temp-option ${temperature === 'HOT' ? 'active' : ''}`}>
            <input
              type="radio"
              name={`temp-${menu.id}`}
              checked={temperature === 'HOT'}
              onChange={() => handleTemperatureChange('HOT')}
            />
            <span>HOT</span>
          </label>
        </div>
      )}
      <div className="menu-info">
        <div className="menu-name-row">
          <h3 className="menu-name">{menu.name}</h3>
          {(isCoffee || isNonCoffee) && (
            <div className="size-selector">
              <label className={`size-option ${size === 'S' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name={`size-${menu.id}`}
                  checked={size === 'S'}
                  onChange={() => handleSizeChange('S')}
                />
                <span>S</span>
              </label>
              <label className={`size-option ${size === 'M' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name={`size-${menu.id}`}
                  checked={size === 'M'}
                  onChange={() => handleSizeChange('M')}
                />
                <span>M</span>
              </label>
              <label className={`size-option ${size === 'L' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name={`size-${menu.id}`}
                  checked={size === 'L'}
                  onChange={() => handleSizeChange('L')}
                />
                <span>L</span>
              </label>
            </div>
          )}
        </div>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
      </div>
      {isCoffee && menu.options && menu.options.length > 0 && (
        <div className="menu-options">
          {menu.options.map((option) => (
            <label key={option.name} className="option-checkbox">
              <input
                type="checkbox"
                checked={selectedOptions.some(opt => opt.name === option.name)}
                onChange={() => handleOptionToggle(option)}
                aria-label={`${menu.name} ${option.name} 옵션`}
              />
              <span>
                {option.name} ({option.price > 0 ? `+${option.price.toLocaleString()}원` : '+0원'})
              </span>
            </label>
          ))}
        </div>
      )}
      <button 
        className={`add-to-cart-btn ${(isCoffee || isNonCoffee) && !temperature ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={(isCoffee || isNonCoffee) && !temperature}
        aria-label={`${menu.name} 장바구니에 추가`}
      >
        담기
      </button>
    </div>
  )
}

MenuCard.propTypes = {
  menu: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    category: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
      })
    )
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
}

export default MenuCard

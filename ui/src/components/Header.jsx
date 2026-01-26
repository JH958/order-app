import PropTypes from 'prop-types'
import './Header.css'

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">COZY</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => onNavigate('order')}
            aria-label="주문하기 페이지로 이동"
            aria-current={currentPage === 'order' ? 'page' : undefined}
          >
            주문하기
          </button>
          <button
            className={`nav-tab ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
            aria-label="관리자 페이지로 이동"
            aria-current={currentPage === 'admin' ? 'page' : undefined}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  )
}

Header.propTypes = {
  currentPage: PropTypes.oneOf(['order', 'admin']).isRequired,
  onNavigate: PropTypes.func.isRequired
}

export default Header

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
          >
            주문하기
          </button>
          <button
            className={`nav-tab ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header

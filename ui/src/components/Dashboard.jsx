import './Dashboard.css'
import PropTypes from 'prop-types'

function Dashboard({ stats }) {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <span className="stat-item">
          총 주문 <strong>{stats.totalOrders}</strong>
        </span>
        <span className="stat-divider">/</span>
        <span className="stat-item">
          주문 접수 <strong>{stats.pendingOrders}</strong>
        </span>
        <span className="stat-divider">/</span>
        <span className="stat-item">
          제조 중 <strong>{stats.inProgressOrders}</strong>
        </span>
        <span className="stat-divider">/</span>
        <span className="stat-item">
          제조 완료 <strong>{stats.completedOrders}</strong>
        </span>
        <span className="stat-divider">/</span>
        <span className="stat-item">
          픽업 완료 <strong>{stats.pickedUpOrders || 0}</strong>
        </span>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  stats: PropTypes.shape({
    totalOrders: PropTypes.number.isRequired,
    pendingOrders: PropTypes.number.isRequired,
    inProgressOrders: PropTypes.number.isRequired,
    completedOrders: PropTypes.number.isRequired,
    pickedUpOrders: PropTypes.number
  }).isRequired
}

export default Dashboard

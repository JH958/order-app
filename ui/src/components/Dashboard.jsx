import './Dashboard.css'

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
      </div>
    </div>
  )
}

export default Dashboard

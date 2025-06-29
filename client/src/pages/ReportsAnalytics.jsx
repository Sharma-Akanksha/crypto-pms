import AdminLayout from '../components/AdminLayout';
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';

const ReportsAnalytics = () => {
  return (
    <AdminLayout>
      <h1 className="admin-analytics-title">Reports & Analytics</h1>

      <div className="admin-analytics-metrics">
        <div className="admin-metric-card success">
          <p className="admin-metric-label">Trade Success Rate</p>
          <div className="admin-metric-value">
            92% <FiTrendingUp />
          </div>
        </div>

        <div className="admin-metric-card loss">
          <p className="admin-metric-label">Loss Trades (QTD)</p>
          <div className="admin-metric-value">
            9 <FiTrendingDown />
          </div>
        </div>

        <div className="admin-metric-card profit">
          <p className="admin-metric-label">Profitable Trades (QTD)</p>
          <div className="admin-metric-value">
            112 <FiTrendingUp />
          </div>
        </div>

        <div className="admin-metric-card volume">
          <p className="admin-metric-label">Total Volume (USD)</p>
          <div className="admin-metric-value">
            $58,650
          </div>
        </div>
      </div>

      <div className="admin-analytics-chart">
        <h3 className="admin-chart-heading"><FiBarChart2 /> Historical Trends</h3>
        <div className="admin-chart-placeholder">[Insert Chart Here]</div>
      </div>
    </AdminLayout>
  );
};

export default ReportsAnalytics;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaChartLine, FaUserCog, FaListAlt } from 'react-icons/fa';
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardChart from './DashboardChart';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://crypto-pms.onrender.com'
    : '';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTrades, setActiveTrades] = useState(0);
  const [profit30D, setProfit30D] = useState(0);
//   const [chartData, setChartData] = useState([]);

//   const dummyData = [{ date: '2025-06-01', pnl: 100 },
//   { date: '2025-06-02', pnl: 150 },
//   { date: '2025-06-03', pnl: 80 },
//   { date: '2025-06-04', pnl: 200 },
//   { date: '2025-06-05', pnl: 250 },];
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('pms_token');

    if (!token) {
      navigate('/login');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Fetch balance
    axios
      .get(`${BASE_URL}/api/user/balance`, { headers })
      .then((res) => {
        setBalance(res.data?.data);
      })
      .catch((err) => {
        console.error('Balance fetch error:', err.response?.data || err.message);
        navigate('/login');
      })
      .finally(() => setLoading(false));

    // Fetch active trades
    axios
      .get(`${BASE_URL}/api/user/trades/active`, { headers })
      .then((res) => setActiveTrades(res.data?.data?.length || 0))
      .catch((err) => console.warn('Active trades error:', err.message));

    // Fetch 30d profit
    axios
      .get(`${BASE_URL}/api/user/profit/30d`, { headers })
      .then((res) => setProfit30D(res.data?.data?.totalProfit || 0))
      .catch((err) => console.warn('Profit fetch error:', err.message));

    // Fetch chart data
    // axios
    //   .get(`${BASE_URL}/api/user/pl-chart`, { headers })
    //   .then((res) => setChartData(res.data?.data || []))
    //   .catch((err) => console.warn('Chart fetch error:', err.message));
  }, [navigate]);

  return (
    <div className="user-dashboard">
      <aside className="user-sidebar">
        <div className="user-sidebar-title">📊 PMS User</div>
        <ul className="user-nav-menu">
          <li className="active">
            <FaHome className="icon" /> Home
          </li>
          <li>
            <FaChartLine className="icon" /> Trade Settings
          </li>
          <li>
            <FaUserCog className="icon" /> Account Management
          </li>
          <li>
            <FaListAlt className="icon" /> Transaction History
          </li>
        </ul>
      </aside>

      <main className="user-main-content">
        <h1 className="user-page-title">Portfolio Overview</h1>

        {loading ? (
          <p>Loading balance...</p>
        ) : (
          <div className="user-metrics-container">
            <div className="user-metric-card">
              <div className="user-metric-info">
                <p>Current Balance</p>
                <h3>${Number(balance?.totalUSDT || 0).toFixed(2)}</h3>
              </div>
            </div>

            <div className="user-metric-card">
              <div className="user-metric-info">
                <p>Active Trades</p>
                <h3 className="green-text">
                  {activeTrades} <span>📈</span>
                </h3>
              </div>
            </div>

            <div className="user-metric-card">
              <div className="user-metric-info">
                <p>Profit (30d)</p>
                <h3 className="purple-text">
                  ${Number(profit30D?.totalUSDT || 0).toFixed(2)} <span>📈</span>
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="user-chart-card">
          <h2 className="c
          hart-title">Profit/Loss Overview</h2>
          <div className="chart-placeholder">
            {/* <DashboardChart /> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

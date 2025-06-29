import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../components/UserLayout';
import { FaHome, FaChartLine, FaUserCog, FaListAlt } from 'react-icons/fa';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://crypto-pms.onrender.com'
    : '';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [activeTrades, setActiveTrades] = useState(0);
  const [realizedProfit, setRealizedProfit] = useState(0);
  const [unrealizedProfit, setUnrealizedProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

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

    axios
      .get(`${BASE_URL}/api/user/dashboard`, { headers })
      .then((res) => {
        const stats = res.data?.data;
        setBalance(stats?.totalUSDT || 0);
        setActiveTrades(stats?.activeTradesCount || 0);
        setRealizedProfit(stats?.realizedProfit || 0);
        setUnrealizedProfit(stats?.unrealizedProfit || 0);
        setTotalProfit(stats?.totalProfit || 0);
      })
      .catch((err) => {
        console.error('Dashboard fetch error:', err.response?.data || err.message);
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
 
    <UserLayout>

      <main className="user-main-content">
        <h1 className="user-page-title">Portfolio Overview</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="user-metrics-container">
            <div className="user-metric-card">
              <div className="user-metric-info">
                <p>Current Balance</p>
                <h3>${Number(balance).toFixed(2)}</h3>
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
                <p>Realized Profit (30d)</p>
                <h3 className="purple-text">
                  ${Number(realizedProfit)} <span>💰</span>
                </h3>
              </div>
            </div>

            <div className="user-metric-card">
              <div className="user-metric-info">
                <p>Unrealized Profit</p>
                <h3 className="blue-text">
                  ${Number(unrealizedProfit)} <span>📊</span>
                </h3>
              </div>
            </div>

            <div className="user-metric-card">
              <div className="user-metric-info">
                <p>Total Profit</p>
                <h3 className="bold-text">
                  ${Number(totalProfit)} <span>🚀</span>
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="user-chart-card">
          <h2 className="chart-title">Profit/Loss Overview</h2>
          <div className="chart-placeholder">
            {/* <DashboardChart /> */}
          </div>
        </div>
      </main>
    </UserLayout>
    
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { BsPersonFill, BsGraphUp, BsCurrencyDollar } from 'react-icons/bs';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://crypto-pms.onrender.com'
    : '';

const AdminDashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('pms_admin_token');
    
        if (!token) {
          navigate('/admin-login');
          return;
        }
    
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        // Fetch balance
        // axios
        //     .get(`${BASE_URL}/api/user/balance`, { headers })
        //     .then((res) => {
        //     setBalance(res.data?.data);
        //     })
        //     .catch((err) => {
        //     console.error('Balance fetch error:', err.response?.data || err.message);
        //     navigate('/login');
        //     })
        //     .finally(() => setLoading(false));

        // Fetch active trades
        // axios
        //     .get(`${BASE_URL}/api/user/trades/active`, { headers })
        //     .then((res) => setActiveTrades(res.data?.data?.length || 0))
        //     .catch((err) => console.warn('Active trades error:', err.message));


        // Fetch chart data
        // axios
        //   .get(`${BASE_URL}/api/user/pl-chart`, { headers })
        //   .then((res) => setChartData(res.data?.data || []))
        //   .catch((err) => console.warn('Chart fetch error:', err.message));
    }, [navigate]);

    return (
        <AdminLayout>
            <h1 className="page-title">Dashboard Overview</h1>
            {/* Metrics Cards */}
            <div className="metrics-container">
                <div className="metric-card">
                    <div className="metric-icon user-icon">
                        <BsPersonFill />
                    </div>
                    <div className="metric-info">
                        <h3>124</h3>
                        <p>Total Users</p>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon trade-icon">
                            <BsGraphUp />
                        </div>
                        <div className="metric-info">
                            <h3>37</h3>
                            <p>Active Trades</p>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon profit-icon">
                            <BsCurrencyDollar />
                        </div>
                        <div className="metric-info">
                            <h3>$11,950</h3>
                            <p>Profit (30d)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                <div className="chart-card">
                    <h3 className="chart-title">Trade Performance</h3>
                    <div className="chart-placeholder">
                        [Performance Chart Here]
                    </div>
                </div>
                <div className="chart-card">
                    <h3 className="chart-title">Registered Users</h3>
                    <div className="chart-placeholder">
                        [Users Trend Chart Here]
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
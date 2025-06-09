import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaChartLine, FaUserCog, FaListAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem('pms_token');

    if (!token) {
        navigate('/login');
        return;
    }

    axios.get('/api/user/balance', {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then((res) => {
        console.log(res.data);
        setBalance(res.data?.data);
        setLoading(false);
        })
        .catch((err) => {
        console.error('Balance fetch error:', err.response?.data || err.message);
        navigate('/login');
        });
    }, [navigate]);

    return (
    <div className="user-dashboard">
        <aside className="user-sidebar">
        <div className="user-sidebar-title">📊 PMS User</div>
        <ul className="user-nav-menu">
            <li className="active"><FaHome className="icon" /> Home</li>
            <li><FaChartLine className="icon" /> Trade Settings</li>
            <li><FaUserCog className="icon" /> Account Management</li>
            <li><FaListAlt className="icon" /> Transaction History</li>
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
                <h3 className="green-text">2 <span>📈</span></h3>
                </div>
            </div>

            <div className="user-metric-card">
                <div className="user-metric-info">
                <p>Profit (30d)</p>
                <h3 className="purple-text">$320 <span>📈</span></h3>
                </div>
            </div>
            </div>
        )}

        <div className="user-chart-card">
            <h2 className="chart-title">Profit/Loss Overview</h2>
            <div className="chart-placeholder"></div>
        </div>
        </main>
    </div>
    );
};

export default Dashboard;

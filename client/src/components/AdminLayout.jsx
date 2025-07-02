// AdminLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiHome, FiTrendingUp, FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { logoutUser } from '../utils/logout';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <FiHome />, path: '/admin-dashboard' },
    { label: 'Trade Management', icon: <FiTrendingUp />, path: '/trade-management' },
    { label: 'Analytics', icon: <FiBarChart2 />, path: '/reports-analytics' },
    { label: 'Reports', icon: <FiBarChart2 />, path: '/admin-report' }
    // Add more as needed
  ];

  const handleLogout = () => {
    // Optional: clear session/localStorage here
    logoutUser(navigate, true);
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">PMS Admin</h2>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <Link to={item.path} className="nav-link">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Logout Option */}
          <li onClick={handleLogout} className="logout-button">
            <div className="nav-link">
              <FiLogOut className="icon" />
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

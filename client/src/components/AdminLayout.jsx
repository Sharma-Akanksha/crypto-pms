// AdminLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { label: 'Trade Management', icon: <FiTrendingUp />, path: '/trade-management' },
    // Add more as needed
  ];

  const handleLogout = () => {
    // Optional: clear session/localStorage here
    navigate('/admin-login');
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

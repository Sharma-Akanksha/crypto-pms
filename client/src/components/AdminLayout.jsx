// AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiUsers, FiBarChart2 } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <FiHome />, path: '/admin-dashboard' },
    { label: 'Trade Management', icon: <FiTrendingUp />, path: '/trade-management' },
    // { label: 'User Portfolio', icon: <FiUsers />, path: '/admin/user-portfolio' },
    // { label: 'Reports & Analytics', icon: <FiBarChart2 />, path: '/admin/reports' }
  ];

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
        </ul>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
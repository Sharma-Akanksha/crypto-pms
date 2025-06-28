import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaUserCog, FaListAlt, FaSignOutAlt } from 'react-icons/fa';

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Optional: Clear local/session storage here
    navigate('/login');
  };

  return (
    <div className="user-dashboard">
      <aside className="user-sidebar">
        <div className="user-sidebar-title">📊 PMS User</div>
        <ul className="user-nav-menu">
          <li className={isActive('/user/home') ? 'active' : ''}>
            <label><Link to="/user/home"><FaHome className="icon" /> Home</Link></label>
          </li>
          <li className={isActive('/user/trade-settings') ? 'active' : ''}>
            <Link to="/user/trade-settings"><FaChartLine className="icon" /> Trade Settings</Link>
          </li>
          <li className={isActive('/user/account-management') ? 'active' : ''}>
            <Link to="/user/account-management"><FaUserCog className="icon" /> Account Management</Link>
          </li>
          <li className={isActive('/user/transaction-history') ? 'active' : ''}>
            <Link to="/user/transaction-history"><FaListAlt className="icon" /> Transaction History</Link>
          </li>

          {/* Logout button */}
          <li onClick={handleLogout} className="logout-button">
            <div className="nav-link">
              <FaSignOutAlt className="icon" />
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </aside>

      <main className="user-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;

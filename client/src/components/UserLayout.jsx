import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaUserCog, FaListAlt, FaSignOutAlt, FaReceipt } from 'react-icons/fa';
import { logoutUser } from '../utils/logout';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Optional: clear session/localStorage here
    logoutUser(navigate, false);
  };

  return (
    <div className="user-dashboard">
      <aside className="user-sidebar">
        <div className="user-sidebar-title">📊 PMS User</div>
        <ul className="user-nav-menu one">
          <li className={isActive('/dashboard') ? 'active' : ''}>
           <label><Link to="/dashboard"><FaHome className="icon" /> Home</Link></label> 

          </li>
          <li className={isActive('/trade-settings') ? 'active' : ''}>
            <Link to="/trade-settings"><FaChartLine className="icon" /> Trade Settings</Link>
          </li>
          {/* <li className={isActive('account-management') ? 'active' : ''}>
            <Link to="/account-management"><FaUserCog className="icon" /> Account Management</Link>
          </li> */}
          <li className={isActive('/transaction-history') ? 'active' : ''}>
            <Link to="/transaction-history"><FaListAlt className="icon" /> Transaction History</Link>
          </li>
          <li className={isActive('/report') ? 'active' : ''}>
            <Link to="/report"><FaReceipt className="icon" /> Report</Link>
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
       { children }
      </main>
    </div>
  );
};

export default UserLayout;

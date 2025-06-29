import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine, FaUserCog, FaListAlt } from 'react-icons/fa';

const UserLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
          <li className={isActive('/account-management') ? 'active' : ''}>
            <Link to="/account-management"><FaUserCog className="icon" /> Account Management</Link>
          </li>
          <li className={isActive('/transaction-history') ? 'active' : ''}>
            <Link to="/transaction-history"><FaListAlt className="icon" /> Transaction History</Link>
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
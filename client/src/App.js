// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// App.js
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TradeSettings from './pages/TradeSettings';
import AdminReg from './pages/AdminReg';
import AdminLogin from './pages/AdminLogin';
import TradeManagement from './pages/TradeManagement';
// import UserLayout from './components/UserLayout'; 
// import AdminLayout from './components/AdminLayout'; 
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <AppWrapper /> */}
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-signup" element={<AdminReg />} />
          <Route path="admin-login" element={<AdminLogin />} />
          
          {/* <Route path="/user-home" element={<Dashboard />} /> */}
          <Route path="/trade-management" element={<TradeManagement />} />
          <Route path="/trade-settings" element={<TradeSettings />} />
          <Route path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />

          {/* <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          {/* ✅ User Routes with Sidebar */}
          {/* <Route path="/" element={<UserLayout />}>
              <Route path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route path="trade-settings" element={<TradeSettings />} />
            {/* <Route path="account-management" element={<AccountManagement />} />
            <Route path="transaction-history" element={<TransactionHistory />} /> 
          </Route> */}

          {/* ✅ Admin Routes with Admin Layout */}
          {/* <Route path="/" element={<AdminLayout />}>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="trade-management" element={<TradeManagement />} />
            <Route path="admin-signup" element={<AdminReg />} />
            <Route path="admin-login" element={<AdminLogin />} />
          </Route>
          <Route path="/" element={<Login />} />*/}
        </Routes> 
      </div>
    </Router>
  );
}

export default App;
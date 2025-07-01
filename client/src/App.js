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
import ReportsAnalytics from './pages/ReportsAnalytics';
import UserReport from './pages/UserReport';
import TransactionHistory from './pages/TransactionHistory';
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
          <Route path="/reports-analytics" element={<ReportsAnalytics />} />
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="/trade-settings" element={<TradeSettings />} />
          <Route path="report" element={<UserReport />} />
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



// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import UserHome from './pages/UserHome';
// import TradeSettings from './pages/TradeSettings';
// import AdminReg from './pages/AdminReg';
// import AdminLogin from './pages/AdminLogin';
// import TradeManagement from './pages/TradeManagement';
// import ReportsAnalytics from './pages/ReportsAnalytics';
// // import AccountManagement from './components/AccountManagement';
// import TransactionHistory from './pages/TransactionHistory';
// import UserLayout from './components/UserLayout'; 
// import './App.css';

// function AppWrapper() {
//   const location = useLocation();
//   const isAuthPage =
//     location.pathname === '/login' ||
//     location.pathname === '/signup' ||
//     location.pathname === '/admin-login' ||
//     location.pathname === '/admin-signup' ||
//     location.pathname === '/';

//   return (
//     <div className={`${isAuthPage ? 'auth-page' : ''}`}>
//       <Routes>
//         {/* Public / Auth routes */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/admin-signup" element={<AdminReg />} />
//         <Route path="/admin-login" element={<AdminLogin />} />
//         <Route path="/" element={<Login />} />
//         <Route path="/trade-management" element={<TradeManagement />} />
//         <Route path="/reports-analytics" element={<ReportsAnalytics />} />

//         {/* Protected User Routes using a common layout */}
//         <Route path="/user" element={<UserLayout />}>
//           <Route path="home" element={<UserHome />} />
//           <Route path="trade-settings" element={<TradeSettings />} />
//           {/* <Route path="account-management" element={<AccountManagement />} /> */}
//           <Route path="transaction-history" element={<TransactionHistory />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// }

// export default App;


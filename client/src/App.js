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
import UserLayout from './components/UserLayout'; 
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


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
//       <div className="App">
//         <Routes>
//           {/* Public / Auth routes */}
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />
//           <Route path="/admin-signup" element={<AdminReg />} />
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route path="/" element={<Login />} />
//           {/* <Route path="/user-home" element={<Dashboard />} /> */}
//           <Route path="/trade-management" element={<TradeManagement />} />
//           <Route path="dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// }

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
          <Route path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
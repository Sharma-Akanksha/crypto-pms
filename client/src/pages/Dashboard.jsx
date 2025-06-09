import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('pms_token');

    if (!token) {
      navigate('/login'); // If token is missing, redirect
      return;
    }

    axios
      .get('/api/user/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setBalance(res.data?.data); // Adjust based on API response
      })
      .catch((err) => {
        console.error('Balance fetch error:', err.response?.data || err.message);
        navigate('/login'); // Optional: logout on error
      });
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {balance ? (
        <pre>{JSON.stringify(balance, null, 2)}</pre>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
};

export default Dashboard;

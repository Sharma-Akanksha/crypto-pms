import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserLayout from '../components/UserLayout';
import { toast } from 'react-toastify';
import '../App.css';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://crypto-pms.onrender.com'
    : '';


const TradeSettings = () => {
  const [allocation, setAllocation] = useState(60);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

 

  const token = localStorage.getItem('pms_token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch existing user setting from backend
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/settings`, { headers });
      setAllocation(res.data?.data?.tradePercentageLimit || 60);
    } catch (err) {
      console.error('Setting fetch failed', err);
      toast.error('Setting Failed!');
    }
  };
  

  useEffect(() => {
    fetchSettings();
  }, []);

  // useEffect(() => {
  //   if(saved){
  //     const timer = setTimeout(() =>{
  //       setSaved(false);
  //     }, 3000);

  //     return () => clearTimeout(timer);

  //   }
    
  // }, [saved]);

  
  const handleSave = async () => {

    setLoading(true);
    setSaved(false);

    try {
      await axios.put(`${BASE_URL}/api/user/settings`, {
        tradePercentageLimit: Number(allocation)
      }, { headers });

      setSaved(true);
      toast.success('Saved successfully');
    } catch (err) {
      toast.error('Error saving allocation');
    } finally {
      setLoading(false);
      
    }
  };

  

  return (
    <UserLayout>
      <div className="trade-settings-container">
        <div className="trade-settings-card">
          <h2 className="trade-settings-title">Allocation Percentage</h2>

          <div className="slider-section">
            <input
              type="range"
              min="0"
              max="100"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              className="slider"
            />
            <div className="allocation-value">{allocation}%</div>
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>

          {/* {saved && <p style={{ color: 'green' }}>Saved successfully ✅</p>} */}
        </div>

      </div>
    </UserLayout>
  );
};

export default TradeSettings;

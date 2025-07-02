import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';
import '../App.css';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://crypto-pms.onrender.com'
  : 'http://localhost:5000';


const TradeManagement = () => {
  // const recentTrades = [
  //   { id: 1, pair: 'BTC/USDT', type: 'Buy', amount: 0.3, status: 'Success', date: '2025-05-27' },
  //   { id: 2, pair: 'BTC/USDT', type: 'Sell', amount: 0.4, status: 'Failed', date: '2025-05-27' },
  // ];
  const [form, setForm] = useState({
    symbol: '',
    side: 'buy',
    quantity: ''
  });
  const [symbols, setSymbols] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);

  const token = localStorage.getItem('pms_admin_token');

  // 🔁 Fetch available trading pairs (symbols)
  const fetchSymbols = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/market/symbols`);
      setSymbols(res.data.data || []);
    } catch (err) {
      console.error('Symbol fetch failed', err);
    }
  };

  // 🔁 Fetch recent trades (admin)
  const fetchTrades = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/trades`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("res trades", res.data.data);
      setRecentTrades(res.data.data || []);
    } catch (err) {
      console.error('Trade fetch failed', err);
      toast.error('Trade Retreive Issue');
    }
  };

  useEffect(() => {
    fetchSymbols();
    fetchTrades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.symbol || !form.quantity || !form.side) return alert('Fill all fields');

    try {
      const payload = {
        symbol: form.symbol,
        side: form.side,
        orderType: 'market',
        force: 'gtc',
        quantity: form.quantity
      };

      const res = await axios.post(`${BASE_URL}/api/admin/place-copy-trade`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(res.data.message || 'Trade placed successfully!');
      setForm({ symbol: '', side: 'buy', quantity: '' });
      fetchTrades();
    } catch (err) {
      console.error('Place order failed:', err);
      toast.error(err.response?.data?.message || 'Order failed!');
    }
  };



  return (
    <AdminLayout>
      <h1 className="trade-title">📈 Trade Management</h1>

      {/* 🧾 Admin Order Form */}
      <form className="trade-form" onSubmit={handleSubmit}>
        <select name="symbol" value={form.symbol} onChange={handleChange} required>
          <option value="">Select Symbol</option>
          {symbols.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.baseCoin}/{s.quoteCoin}
            </option>
          ))}
        </select>

        <select name="side" value={form.side} onChange={handleChange}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity (e.g. 1)"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <select disabled>
          <option>market</option>
        </select>

        <select disabled>
          <option>gtc</option>
        </select>

        <button className="trade-button" type="submit">
          Place & Copy Trade
        </button>
      </form>

      {/* 📜 Trade History Table */}
      <div className="trade-history">
        <h2 className="recent-trades-title">📊 Recent Trades</h2>
        <table className="trades-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Symbol</th>
              {/* <th>Buy</th>
              <th>Sell</th> */}
              <th>Quantity</th>
              <th>User</th>
              {/* <th>Date</th> */}
            </tr>
          </thead>
          <tbody>
            {recentTrades.length === 0 ? (
              <tr>
                <td colSpan="7">No trades yet</td>
              </tr>
            ) : (
              recentTrades.map((trade, index) => (
                <tr key={trade._id}>
                  <td>{index + 1}</td>
                  <td>{trade.coin}</td>
                  {/* <td className='buy'>{trade.totalBuy}</td>
                  <td className='sell'>{trade.totalSell}</td> */}
                  <td>{trade.finalBalance}</td>
                  {/* <td className={trade.status === 'placed' ? 'status success' : 'status failed'}>
                    {trade.status === 'placed' ? 'Success' : 'Failed' }
                  </td> */}
                  <td>{trade.userEmail}</td>
                  {/* <td>{new Date(trade.createdAt).toLocaleDateString()}</td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default TradeManagement;
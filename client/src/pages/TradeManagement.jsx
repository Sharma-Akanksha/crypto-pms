import React from 'react';
import AdminLayout from '../components/AdminLayout';
import '../App.css';

const TradeManagement = () => {
  const recentTrades = [
    { id: 1, pair: 'BTC/USDT', type: 'Buy', amount: 0.3, status: 'Success', date: '2025-05-27' },
    { id: 2, pair: 'BTC/USDT', type: 'Sell', amount: 0.4, status: 'Failed', date: '2025-05-27' },
  ];

  return (
    <AdminLayout>
      <h1 className="trade-title">📈 Trade Management</h1>

      <div className="trade-form">
        <input type="text" placeholder="Symbol" />
        
        <select>
          <option>Buy</option>
          <option>Sell</option>
        </select>

        <input type="number" placeholder="e.g. 0.5" />

        <select disabled>
          <option>market</option>
        </select>

        <select disabled>
          <option>gtc</option>
        </select>

        <button className="trade-button">Place Trade</button>
        <p className="form-note">[Mockup only: Form disabled]</p>
      </div>

      <div className="trade-history">
        <h2 className="recent-trades-title">📊 Recent Trades</h2>
        <table className="trades-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pair</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTrades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.id}</td>
                <td>{trade.pair}</td>
                <td className={trade.type === 'Buy' ? 'buy' : 'sell'}>{trade.type}</td>
                <td>{trade.amount}</td>
                <td>
                  <span className={`status ${trade.status.toLowerCase()}`}>
                    {trade.status}
                  </span>
                </td>
                <td>{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default TradeManagement;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserLayout from '../components/UserLayout';
import '../App.css';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://crypto-pms.onrender.com'
  : '';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('pms_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user/trades/history`, { headers })
      .then((res) => setTransactions(res.data?.data || []))
      .catch((err) => {
        console.error('Error fetching transaction history:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <main className="user-main-content">
        <h1 className="user-transactions-title">Transaction History</h1>

        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="user-transaction-table-wrapper">
            <table className="user-transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pair</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Profit / Loss</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="neutral-text">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((tx, index) => (
                    <tr key={index}>
                    <td className="neutral-text">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="neutral-text">{tx.pair || '-'}</td>
                    <td className={tx.type === 'buy' ? 'buy-text' : 'sell-text'}>
                      {tx.type?.toUpperCase() || '-'}
                    </td>
                    <td className="neutral-text">{tx.amount || '-'}</td>
                    <td className="neutral-text">
                      { tx.profitLoss }
                    </td>
                    <td>
                      <span className={`status-badge ${tx.status?.toLowerCase()}`}>
                        {tx.status || '-'}
                      </span>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </UserLayout>
  );
};

export default TransactionHistory;

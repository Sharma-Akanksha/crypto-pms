import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserLayout from '../components/UserLayout';
import '../App.css';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://crypto-pms.onrender.com'
  : '';

const ITEMS_PER_PAGE = 10;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  console.log(transactions);

  // Pagination Logic
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTx = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log("paginatedTx", totalPages);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                  paginatedTx.map((tx, index) => (
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
                        {tx.status === "Placed" ? "Success": "Failed" || '-'}
                      </span>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                ◀ Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next ▶
              </button>
            </div>
          </div>
        )}
      </main>
    </UserLayout>
  );
};

export default TransactionHistory;

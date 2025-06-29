import React from 'react';

const TransactionHistory = () => {
  const transactions = [
    {
      date: '2025-05-25',
      pair: 'BTC/USDT',
      type: 'Buy',
      amount: 0.2,
      profitLoss: '+$120',
      status: 'Success',
    },
    {
      date: '2025-05-20',
      pair: 'ETH/USDT',
      type: 'Sell',
      amount: 2,
      profitLoss: '-$50',
      status: 'Failed',
    },
    {
      date: '2025-05-12',
      pair: 'BNB/USDT',
      type: 'Buy',
      amount: 5,
      profitLoss: '+$61',
      status: 'Success',
    },
  ];

  return (
    <main className="user-main-content">
      <h1 className="user-transactions-title">Transaction History</h1>

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
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td className="neutral-text">{tx.date}</td>
                <td className="neutral-text">{tx.pair}</td>
                <td className={tx.type === 'Buy' ? 'buy-text' : 'sell-text'}>{tx.type}</td>
                <td className="neutral-text">{tx.amount}</td>
                <td className={tx.profitLoss.startsWith('-') ? 'loss-text' : 'profit-text'}>
                  {tx.profitLoss}
                </td>
                <td>
                  <span className={`status-badge ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TransactionHistory;

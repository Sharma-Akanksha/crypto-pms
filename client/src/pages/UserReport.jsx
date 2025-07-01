import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import UserLayout from '../components/UserLayout';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://crypto-pms.onrender.com'
  : '';

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('daily');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('pms_token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${BASE_URL}/api/user/report?selectRange=${selectedRange}`, { headers });
        setReportData(res.data?.data || []);
      } catch (err) {
        console.error('❌ Error fetching report:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedRange]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    doc.setFontSize(16);
    doc.text('Quantum Edge - Portfolio Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${date}    Time: ${time}`, 14, 28);

    const tableBody = reportData.map(item => ([
      item.symbol || '-',
      (item.totalBuy || 0).toFixed(4),
      (item.avgBuyPrice || 0).toFixed(6),
      (item.totalSell || 0).toFixed(4),
      `$${(item.realizedPnL || 0).toFixed(2)}`,
      `$${(item.unrealizedPnL || 0).toFixed(2)}`,
      item.purchaseDate || '-',
      `$${(item.currentValue || 0).toFixed(2)}`
    ]));

    autoTable(doc, {
      startY: 35,
      head: [['Coin', 'Buy Qty', 'Avg Buy Price', 'Sell Qty', 'Realized PnL', 'Unrealized PnL', 'Purchase Date', 'Current Value (USDT)']],
      body: tableBody,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255 },
    });

    doc.save('Quantum_Edge_Report.pdf');
  };

  const downloadCSV = () => {
    const headers = ['Coin', 'Buy Qty', 'Avg Buy Price', 'Sell Qty', 'Realized PnL', 'Unrealized PnL', 'Purchase Date', 'Current Value (USDT)'];
    const rows = reportData.map(item => [
      item.symbol,
      (item.totalBuy || 0).toFixed(4),
      (item.avgBuyPrice || 0).toFixed(6),
      (item.totalSell || 0).toFixed(4),
      (item.realizedPnL || 0).toFixed(2),
      (item.unrealizedPnL || 0).toFixed(2),
      item.purchaseDate || '-',
      `$${(item.currentValue || 0).toFixed(2)}`
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Quantum_Edge_Report.csv';
    a.click();
  };

  return (
    <UserLayout>
      <div className="report-container" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            {['daily', 'weekly', 'monthly'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                style={{
                  marginRight: '10px',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: selectedRange === range ? '#4a90e2' : '#ccc',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <div>
            <button onClick={generatePDF} className="download-button">📄 Download PDF</button>
            <button onClick={downloadCSV} className="download-button">📥 Download CSV</button>
          </div>
        </div>

        {loading ? (
          <p>Loading report...</p>
        ) : reportData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Buy Qty</th>
                <th>Avg Buy Price</th>
                <th>Sell Qty</th>
                <th>Realized PnL</th>
                <th>Unrealized PnL</th>
                <th>Purchase Date</th>
                <th>Current Value (USDT) </th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.symbol}</td>
                  <td>{(item.totalBuy || 0).toFixed(4)}</td>
                  <td>{(item.avgBuyPrice || 0).toFixed(6)}</td>
                  <td>{(item.totalSell || 0).toFixed(4)}</td>
                  <td style={{ color: item.realizedPnL >= 0 ? 'green' : 'red' }}>${(item.realizedPnL || 0).toFixed(2)}</td>
                  <td style={{ color: item.unrealizedPnL >= 0 ? 'green' : 'red' }}>${(item.unrealizedPnL || 0).toFixed(2)}</td>
                  <td>{item.purchaseDate || '-'}</td>
                  <td>${(item.currentValue || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </UserLayout>
  );
};

export default Report;

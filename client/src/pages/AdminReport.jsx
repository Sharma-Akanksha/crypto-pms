import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import '../App.css';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://crypto-pms.onrender.com'
    : '';

const AdminReport = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('weekly');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('pms_admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${BASE_URL}/api/admin/report?selectRange=${selectedRange}`, { headers });
      setReportData(res.data?.data || []);
    } catch (err) {
      console.error('Admin Report fetch error:', err);
      toast.error('Admin Report Fetching Issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedRange]);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    doc.setFontSize(16);
    doc.text('Quantum Edge - Admin Portfolio Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${date}    Time: ${time}`, 14, 28);

    autoTable(doc, {
        head: [
            ['User', 'Coin', 'Buy Qty', 'Avg Buy Price', 'Sell Qty', 'Realized PnL', 'Unrealized PnL', 'Purchase Date'],
        ],
        body: reportData.map((item) => [
            item.userEmail || 'N/A',
            item.symbol,
            item.totalBuy?.toFixed(4) || '-',
            item.avgBuyPrice?.toFixed(6) || '-',
            item.totalSell?.toFixed(4) || '-',
            `$${(item.realizedPnL || 0).toFixed(2)}`,
            `$${(item.unrealizedPnL || 0).toFixed(2)}`,
            item.purchaseDate || '-',
        ]),
        startY: 35,
        styles: {
            fontSize: 9,
            overflow: 'linebreak',
            cellWidth: 'wrap',
            halign: 'center'
        },
        headStyles: {
            fillColor: [40, 53, 147],
            textColor: [255, 255, 255],
            halign: 'center',
        },
        columnStyles: {
            0: { cellWidth: 40 }, // User
            1: { cellWidth: 20 }, // Coin
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 },
            7: { cellWidth: 30 }, // Purchase Date
        },
    });


    doc.save(`Quantum_Edge_Admin_Report_${selectedRange}.pdf`);
  };

  const downloadCSV = () => {
    const rows = [
      ['User', 'Coin', 'Buy Qty', 'Avg Buy Price', 'Sell Qty', 'Realized PnL', 'Unrealized PnL', 'Purchase Date'],
      ...reportData.map((item) => [
        item.userEmail,
        item.symbol,
        (item.totalBuy || 0).toFixed(2),
        (item.avgBuyPrice || 0).toFixed(6),
        (item.totalSell || 0).toFixed(2),
        (item.realizedPnL || 0).toFixed(2),
        (item.unrealizedPnL || 0).toFixed(2),
        item.purchaseDate || '-',
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Quantum_Edge_Admin_Report_${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="report-container" style={{ padding: '1.5rem' }}>
        <h1 className="page-title">📋 All Users Portfolio Report</h1>

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
          <p>Loading...</p>
        ) : reportData.length === 0 ? (
          <p>No data available.</p>
        ) : (
        <table className="admin-report-table">
            <thead>
                <tr>
                <th>User</th>
                <th>Coin</th>
                <th>Buy Qty</th>
                <th>Avg Buy Price</th>
                <th>Sell Qty</th>
                <th>Realized PnL</th>
                <th>Unrealized PnL</th>
                <th>Purchase Date</th>
                </tr>
            </thead>
            <tbody>
                {reportData.map((item, index) => (
                <tr key={index}>
                    <td className="email">{item.userEmail}</td>
                    <td>{item.symbol}</td>
                    <td>{item.totalBuy?.toFixed(4) || '-'}</td>
                    <td>{item.avgBuyPrice?.toFixed(6) || '-'}</td>
                    <td>{item.totalSell?.toFixed(4) || '-'}</td>
                    <td className={item.realizedPnL >= 0 ? 'green' : 'red'}>
                    ${Number(item.realizedPnL || 0).toFixed(2)}
                    </td>
                    <td className={item.unrealizedPnL >= 0 ? 'green' : 'red'}>
                    ${Number(item.unrealizedPnL || 0).toFixed(2)}
                    </td>
                    <td>{item.purchaseDate || '-'}</td>
                </tr>
                ))}
            </tbody>
        </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReport;

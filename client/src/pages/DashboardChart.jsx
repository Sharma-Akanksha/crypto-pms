import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const dummyData = [
  { date: '2025-06-01', pnl: 100 },
  { date: '2025-06-02', pnl: 200 },
  { date: '2025-06-03', pnl: 150 },
  { date: '2025-06-04', pnl: 300 },
];

export default function DashboardChart() {
  return (
    <div className="user-chart-card">
      <h2 className="chart-title">Profit/Loss Overview</h2>
      <LineChart width={600} height={300} data={dummyData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="pnl" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}


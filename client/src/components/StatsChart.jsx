import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsChart = ({ coupons }) => {
  // Logic: Count coupons per category
  const data = [
    { name: 'Fashion', value: 0, color: '#ec4899' }, // Pink
    { name: 'Food', value: 0, color: '#f59e0b' },    // Orange
    { name: 'Tech', value: 0, color: '#3b82f6' },    // Blue
    { name: 'Travel', value: 0, color: '#10b981' },  // Green
    { name: 'Other', value: 0, color: '#6b7280' },   // Gray
  ];

  coupons.forEach(coupon => {
    const category = data.find(d => d.name === coupon.category);
    if (category) category.value += 1;
    else {
      // Handle custom categories if any, or map to 'Other'
      const other = data.find(d => d.name === 'Other');
      other.value += 1;
    }
  });

  // Filter out empty categories so the chart looks clean
  const activeData = data.filter(d => d.value > 0);

  if (coupons.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Coupon Distribution</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={activeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {activeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-400 mt-2">Total Coupons: {coupons.length}</p>
    </div>
  );
};

export default StatsChart;
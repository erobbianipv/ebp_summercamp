import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  totalRevenues: number;
  totalCosts: number;
}

const Chart: React.FC<ChartProps> = ({ totalRevenues, totalCosts }) => {
  const data = [
    {
      name: 'Financials',
      Revenues: totalRevenues,
      Costs: totalCosts,
    },
  ];

  return (
    <div className="bg-white/5 rounded-xl p-4 md:p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-widest text-white/80">Financial Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
          <YAxis stroke="rgba(255, 255, 255, 0.7)" tickFormatter={(value) => `€${value / 1000}k`} />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{ 
              backgroundColor: 'rgba(30, 30, 30, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff'
            }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Bar dataKey="Revenues" fill="#16a34a" name="Revenues" />
          <Bar dataKey="Costs" fill="#dc2626" name="Costs" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

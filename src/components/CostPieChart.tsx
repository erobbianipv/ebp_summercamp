import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BudgetItem } from '../types';

interface CostPieChartProps {
  costs: BudgetItem[];
}

const COLORS = ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'];

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 p-2 border border-white/20 rounded-md shadow-lg">
        <p className="text-white font-bold">{`${payload[0].name}`}</p>
        <p className="text-white/80">{`Cost: €${payload[0].value.toLocaleString('it-IT')}`}</p>
        <p className="text-white/80">{`Percentage: ${payload[0].payload.percent.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const CostPieChart: React.FC<CostPieChartProps> = ({ costs }) => {
  const totalCost = costs.reduce((acc, item) => acc + item.total, 0);
  const chartData = costs.map(item => ({
    name: item.name,
    value: item.total,
    percent: totalCost > 0 ? (item.total / totalCost) * 100 : 0,
  }));

  return (
    <div className="bg-white/5 rounded-xl p-4 md:p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-widest text-white/80">Cost Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostPieChart;

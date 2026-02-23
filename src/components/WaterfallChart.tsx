import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine, Cell } from 'recharts';
import { BudgetItem, Scenario } from '../types';

interface WaterfallChartProps {
  scenario: Scenario;
}

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-800 p-2 border border-white/20 rounded-md shadow-lg">
        <p className="text-white font-bold">{data.name}</p>
        <p className={`font-mono ${data.name === 'Total Revenues' ? 'text-green-400' : data.name === 'Net Profit' ? (data.value >= 0 ? 'text-green-400' : 'text-red-400') : 'text-red-400'}`}>
          {data.name === 'Total Revenues' || data.name === 'Net Profit' ? `€${data.value.toLocaleString('it-IT')}` : `-€${Math.abs(data.value).toLocaleString('it-IT')}`}
        </p>
      </div>
    );
  }
  return null;
};

const WaterfallChart: React.FC<WaterfallChartProps> = ({ scenario }) => {
  const { revenues, costs } = scenario;
  const totalRevenues = revenues.reduce((acc, item) => acc + item.total, 0);
  const totalCosts = costs.reduce((acc, item) => acc + item.total, 0);
  const netProfit = totalRevenues - totalCosts;

  const chartData = React.useMemo(() => {
    let cumulative = 0;
    const data = [];

    // 1. Total Revenues
    data.push({ name: 'Total Revenues', value: totalRevenues, range: [0, totalRevenues] });
    cumulative = totalRevenues;

    // 2. Costs
    costs.forEach(cost => {
      const start = cumulative - cost.total;
      data.push({ name: cost.name, value: -cost.total, range: [start, cumulative] });
      cumulative -= cost.total;
    });

    // 3. Net Profit
    data.push({ name: 'Net Profit', value: netProfit, range: [0, netProfit] });

    return data;
  }, [revenues, costs, totalRevenues, netProfit]);

  return (
    <div className="bg-white/5 rounded-xl p-4 md:p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-widest text-white/80">Revenue Breakdown</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" angle={-45} textAnchor="end" height={80} interval={0} />
          <YAxis stroke="rgba(255, 255, 255, 0.7)" tickFormatter={(value) => `€${value / 1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
          <ReferenceLine y={0} stroke="#fff" strokeOpacity={0.5} />
          <Bar dataKey="range">
            {chartData.map((entry, index) => {
              let color = '#ef4444'; // Cost
              if (entry.name === 'Total Revenues') color = '#22c55e'; // Revenue
              if (entry.name === 'Net Profit') color = entry.value >= 0 ? '#60a5fa' : '#f87171'; // Net Profit
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterfallChart;

import { TrendingUp, TrendingDown, Scale, Percent } from 'lucide-react';

interface SummaryProps {
  totalRevenues: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
}

const SummaryCard = ({ icon: Icon, title, value, colorClass, isCurrency = true }) => (
  <div className="bg-black p-4 rounded-lg flex items-start">
    <div className={`mr-4 mt-1 p-2 rounded-lg bg-white/5 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-2xl font-bold font-mono">
        {isCurrency ? `€${value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${value.toFixed(1)}%`}
      </p>
    </div>
  </div>
);

export default function Summary({ totalRevenues, totalCosts, netProfit, profitMargin }: SummaryProps) {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20">
      <h2 className="text-xl font-bold mb-6 text-center uppercase tracking-widest">Financial Overview</h2>
      <div className="space-y-4">
        <SummaryCard icon={TrendingUp} title="Total Revenues" value={totalRevenues} colorClass="text-green-400" />
        <SummaryCard icon={TrendingDown} title="Total Costs" value={totalCosts} colorClass="text-red-400" />
        <div className="border-t border-white/10 my-4"></div>
        <SummaryCard icon={Scale} title="Net Profit" value={netProfit} colorClass={netProfit >= 0 ? 'text-green-400' : 'text-red-400'} />
        <SummaryCard icon={Percent} title="Profit Margin" value={profitMargin} colorClass={netProfit >= 0 ? 'text-green-400/70' : 'text-red-400/70'} isCurrency={false} />
      </div>
    </div>
  );
}

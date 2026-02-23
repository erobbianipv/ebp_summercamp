import React from 'react';
import { User, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface PerAthleteStatsProps {
  numberOfAthletes: number;
  revenuePerAthlete: number;
  costPerAthlete: number;
  profitPerAthlete: number;
}

const StatRow = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
    <div className="flex items-center">
      <Icon size={16} className={`mr-3 ${colorClass}`} />
      <span className="text-white/70 text-sm">{label}</span>
    </div>
    <span className="font-bold text-lg font-mono">€{value.toFixed(2)}</span>
  </div>
);

const PerAthleteStats: React.FC<PerAthleteStatsProps> = ({ 
  numberOfAthletes,
  revenuePerAthlete,
  costPerAthlete,
  profitPerAthlete
}) => {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 mt-8">
      <div className="flex items-center justify-center mb-6">
        <User size={20} className="mr-3 text-white/60" />
        <h2 className="text-xl font-bold text-center uppercase tracking-widest">Per-Athlete Stats ({numberOfAthletes})</h2>
      </div>
      <div className="space-y-3">
        <StatRow icon={TrendingUp} label="Avg. Revenue" value={revenuePerAthlete} colorClass="text-green-400" />
        <StatRow icon={TrendingDown} label="Avg. Cost" value={costPerAthlete} colorClass="text-red-400" />
        <StatRow icon={Wallet} label="Profit/Athlete" value={profitPerAthlete} colorClass={profitPerAthlete > 0 ? 'text-blue-400' : 'text-red-400'} />
      </div>
    </div>
  );
};

export default PerAthleteStats;

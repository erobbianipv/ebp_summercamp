import React from 'react';
import Papa from 'papaparse';
import { Download } from 'lucide-react';

const SensitivityMatrix: React.FC = () => {
    const fees = Array.from({ length: (1600 - 700) / 50 + 1 }, (_, i) => 700 + i * 50);
    const participants = Array.from({ length: (40 - 10) / 5 + 1 }, (_, i) => 10 + i * 5);

  const calculateProfit = (fee: number, p: number): number => {
    const totalRevenue = (fee * p) + (30 * p);
    let totalCosts = 0;
    totalCosts += 20 * p * 3; // Kit
    totalCosts += (p <= 30 ? 2 : 3) * 500; // Head Coach
    totalCosts += p <= 25 ? 200 : 300; // Chef
    totalCosts += p * 10 * 7; // Lunches
    totalCosts += p <= 25 ? 300 : 400; // Utilities
    totalCosts += p <= 15 ? 40 : 80; // Transport
    totalCosts += 30; // Store Staff
    if (p <= 15) totalCosts += 300; // Physiotherapist
    else if (p <= 30) totalCosts += 600;
    else totalCosts += 900;
    return totalRevenue - totalCosts;
  };

  const profitData = fees.map(fee => 
    participants.map(p => calculateProfit(fee, p))
  );
  
  const allProfits = profitData.flat();
  const minProfit = Math.min(...allProfits);
  const maxProfit = Math.max(...allProfits);

  const getProfitCellClasses = (profit: number): string => {
    const range = maxProfit - minProfit;
    let bgColor = '';
    if (range === 0) {
      bgColor = profit >= 0 ? 'bg-green-700/50' : 'bg-red-700/50';
    } else {
      const percentage = (profit - minProfit) / range;
      if (percentage < 0.2) bgColor = 'bg-red-800/70';
      else if (percentage < 0.4) bgColor = 'bg-orange-700/70';
      else if (percentage < 0.6) bgColor = 'bg-yellow-600/70';
      else if (percentage < 0.8) bgColor = 'bg-lime-500/70';
      else bgColor = 'bg-green-500/70';
    }
    return `${bgColor} text-white`;
  };

  const handleExport = () => {
    const csvData = fees.map((fee, feeIndex) => {
      const row: { [key: string]: string | number } = { 'Fee / Participants': `€${fee}` };
      participants.forEach((p, pIndex) => {
        row[p] = `€${profitData[feeIndex][pIndex]}`;
      });
      return row;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sensitivity-matrix.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const legendItems = [
    { color: 'bg-red-800/70', label: 'Low' },
    { color: 'bg-orange-700/70', label: '' },
    { color: 'bg-yellow-600/70', label: 'Medium' },
    { color: 'bg-lime-500/70', label: '' },
    { color: 'bg-green-500/70', label: 'High' },
  ];

  return (
    <div className="bg-white/5 rounded-xl p-4 md:p-6 mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-center uppercase tracking-widest text-white/80">Profit Sensitivity Matrix</h2>
        <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>
      <div className="flex justify-center items-center gap-4 mb-6 text-xs text-white/70">
        <span>Profit:</span>
        {legendItems.map(item => (
          <div key={item.label || item.color} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white/80">
          <thead className="text-xs text-white/60 uppercase bg-white/10">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">
                Fee / Participants
              </th>
              {participants.map(p => (
                <th key={p} scope="col" className="px-6 py-3 text-center">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, feeIndex) => (
              <tr key={fee} className="border-b border-white/10">
                <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap bg-zinc-900/50">
                  €{fee.toLocaleString('it-IT')}
                </th>
                {participants.map((p, pIndex) => {
                  const profit = profitData[feeIndex][pIndex];
                  const cellClasses = getProfitCellClasses(profit);
                  return (
                    <td key={`${fee}-${p}`} className={`px-6 py-4 text-center font-mono transition-colors ${cellClasses}`}>
                      €{profit.toLocaleString('it-IT')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensitivityMatrix;

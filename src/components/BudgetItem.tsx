import React from 'react';
import { motion } from 'motion/react';
import { BudgetItem as BudgetItemType } from '../types';
import { Trash2 } from 'lucide-react';

interface BudgetItemProps {
  item: BudgetItemType;
  onUpdate: (id: number, field: 'quantity' | 'unitCost' | 'name', value: number | string) => void;
  onRemove: (id: number) => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ item, onUpdate, onRemove }) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0);
  };

  const handleUnitCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, 'unitCost', parseFloat(e.target.value) || 0);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, 'name', e.target.value);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-12 gap-2 items-center py-3 px-2 border-b border-white/5 hover:bg-white/10 rounded-lg group"
    >
      <div className="col-span-5">
        <input 
          type="text" 
          value={item.name} 
          onChange={handleNameChange}
          className="bg-transparent w-full focus:outline-none focus:bg-green-900/50 rounded-md p-1.5 font-medium transition-colors"
        />
      </div>
      <div className="col-span-2">
        <input 
          type="number" 
          value={item.quantity} 
          onChange={handleQuantityChange}
          className="bg-white/10 rounded-md p-1.5 w-full text-center font-mono focus:bg-green-900/50 focus:outline-none transition-colors"
        />
      </div>
      <div className="col-span-2 text-right">
        <input 
          type="number" 
          value={item.unitCost}
          onChange={handleUnitCostChange}
          className="bg-white/10 rounded-md p-1.5 w-full text-right font-mono focus:bg-green-900/50 focus:outline-none transition-colors"
        />
      </div>
      <div className="col-span-2 text-right font-mono">
        <span className="text-white/50 mr-1">€</span>
        <span>{item.total.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div className="col-span-1 text-right">
        <button onClick={() => onRemove(item.id)} className="text-white/40 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default BudgetItem;

import { BudgetItem as BudgetItemType } from '../types';
import BudgetItem from './BudgetItem';
import { PlusCircle } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface BudgetCategoryProps {
  title: string;
  items: BudgetItemType[];
  onUpdate: (id: number, field: 'quantity' | 'unitCost' | 'name', value: number | string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
}

export default function BudgetCategory({ title, items, onUpdate, onAddItem, onRemoveItem }: BudgetCategoryProps) {
  return (
    <div className="bg-black rounded-xl p-4 md:p-6 mb-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white/80">{title}</h2>
        <button onClick={onAddItem} className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <PlusCircle size={16} />
          <span>Add Item</span>
        </button>
      </div>
      <div>
        <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs uppercase text-white/50 font-bold">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Cost</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1 text-right"></div>
        </div>
        <Droppable droppableId={title} type="BUDGET_ITEM">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BudgetItem item={item} onUpdate={onUpdate} onRemove={onRemoveItem} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

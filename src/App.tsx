/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import Header, { View } from './components/Header';
import BudgetCategory from './components/BudgetCategory';
import Summary from './components/Summary';
import ScenarioTabs from './components/ScenarioTabs';
import Chart from './components/Chart';
import CostPieChart from './components/CostPieChart';
import WaterfallChart from './components/WaterfallChart';
import PerAthleteStats from './components/PerAthleteStats';
import SensitivityMatrix from './components/SensitivityMatrix';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { BudgetItem, Scenario } from './types';
import { saveScenarios, loadScenarios } from './persistence';
import { exportScenarioToCsv } from './csvExporter';
import Papa from 'papaparse';

const initialCosts: BudgetItem[] = [
  { id: 1, name: 'Kit (Jersey, Shorts)', quantity: 50, unitCost: 35, total: 1750 },
  { id: 2, name: 'Basketballs', quantity: 20, unitCost: 25, total: 500 },
  { id: 3, name: 'Head Coach', quantity: 1, unitCost: 2000, total: 2000 },
  { id: 4, name: 'Assistant Coaches', quantity: 3, unitCost: 1000, total: 3000 },
  { id: 5, name: 'Gym Rental', quantity: 10, unitCost: 150, total: 1500 },
  { id: 6, name: 'Water & Gatorade', quantity: 200, unitCost: 1.5, total: 300 },
  { id: 7, name: 'Lunches', quantity: 500, unitCost: 10, total: 5000 },
];

const initialRevenues: BudgetItem[] = [
  { id: 1, name: 'Participant Fee', quantity: 50, unitCost: 400, total: 20000 },
];

const defaultScenario: Scenario = {
  id: 1,
  name: 'Default Scenario',
  costs: initialCosts,
  revenues: initialRevenues,
};

const initialScenarios = loadScenarios([defaultScenario]);

export default function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [activeScenarioId, setActiveScenarioId] = useState<number>(initialScenarios[0]?.id || 1);
  const [activeView, setActiveView] = useState<View>('scenarios');

  const activeScenario = useMemo(() => scenarios.find(s => s.id === activeScenarioId) || scenarios[0], [scenarios, activeScenarioId]);

  const updateScenario = (updatedScenario: Scenario) => {
    setScenarios(scenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s));
  };

  const handleUpdate = (source: 'costs' | 'revenues') => (id: number, field: 'quantity' | 'unitCost' | 'name', value: number | string) => {
    const updatedItems = activeScenario[source].map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          newItem.total = newItem.quantity * newItem.unitCost;
        }
        return newItem;
      }
      return item;
    });
    updateScenario({ ...activeScenario, [source]: updatedItems });
  };

  const addItem = (source: 'costs' | 'revenues') => {
    const newItem: BudgetItem = {
      id: Date.now(),
      name: 'New Item',
      quantity: 1,
      unitCost: 0,
      total: 0,
    };
    const updatedItems = [...activeScenario[source], newItem];
    updateScenario({ ...activeScenario, [source]: updatedItems });
  };

  const removeItem = (source: 'costs' | 'revenues') => (id: number) => {
    const updatedItems = activeScenario[source].filter(item => item.id !== id);
    updateScenario({ ...activeScenario, [source]: updatedItems });
  };

  const addScenario = () => {
    const newScenario: Scenario = {
      id: Date.now(),
      name: `Scenario ${scenarios.length + 1}`,
      costs: JSON.parse(JSON.stringify(initialCosts)), // Deep copy
      revenues: JSON.parse(JSON.stringify(initialRevenues)), // Deep copy
    };
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newScenario.id);
  };

  const removeScenario = (id: number) => {
    const newScenarios = scenarios.filter(s => s.id !== id);
    setScenarios(newScenarios);
    if (activeScenarioId === id) {
      setActiveScenarioId(newScenarios[0]?.id || 0);
    }
  };

  const renameScenario = (id: number, newName: string) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'SCENARIO') {
      const reorderedScenarios = Array.from(scenarios);
      const [removed] = reorderedScenarios.splice(source.index, 1);
      reorderedScenarios.splice(destination.index, 0, removed);
      setScenarios(reorderedScenarios);
    } else if (type === 'BUDGET_ITEM') {
      const sourceCategory = source.droppableId as 'costs' | 'revenues';
      const destinationCategory = destination.droppableId as 'costs' | 'revenues';

      const sourceItems = [...activeScenario[sourceCategory]];
      const [removed] = sourceItems.splice(source.index, 1);

      if (sourceCategory === destinationCategory) {
        sourceItems.splice(destination.index, 0, removed);
        updateScenario({ ...activeScenario, [sourceCategory]: sourceItems });
      } else {
        const destinationItems = [...activeScenario[destinationCategory]];
        destinationItems.splice(destination.index, 0, removed);
        updateScenario({ 
          ...activeScenario, 
          [sourceCategory]: sourceItems, 
          [destinationCategory]: destinationItems 
        });
      }
    }
  };

  const duplicateScenario = (id: number) => {
    const scenarioToDuplicate = scenarios.find(s => s.id === id);
    if (!scenarioToDuplicate) return;

    const newScenario: Scenario = {
      ...JSON.parse(JSON.stringify(scenarioToDuplicate)), // Deep copy
      id: Date.now(),
      name: `${scenarioToDuplicate.name} (Copy)`,
    };

    const scenarioIndex = scenarios.findIndex(s => s.id === id);
    const newScenarios = [...scenarios];
    newScenarios.splice(scenarioIndex + 1, 0, newScenario);
    
    setScenarios(newScenarios);
    setActiveScenarioId(newScenario.id);
  };

  const handleSave = () => {
    saveScenarios(scenarios);
    alert('Scenarios saved successfully!');
  };

  const handleExport = () => {
    if (activeScenario) {
      exportScenarioToCsv(activeScenario);
    }
  };

  const handleImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const { data } = results;
        const costs: BudgetItem[] = [];
        const revenues: BudgetItem[] = [];

        data.forEach((row: any) => {
          const item: BudgetItem = {
            id: Date.now() + Math.random(),
            name: row.Item,
            quantity: parseFloat(row.Quantity),
            unitCost: parseFloat(row['Unit Cost']),
            total: parseFloat(row.Quantity) * parseFloat(row['Unit Cost']),
          };

          if (row.Category === 'Cost') {
            costs.push(item);
          } else if (row.Category === 'Revenue') {
            revenues.push(item);
          }
        });

        const newScenario: Scenario = {
          id: Date.now(),
          name: file.name.replace('.csv', ''),
          costs,
          revenues,
        };

        setScenarios([...scenarios, newScenario]);
        setActiveScenarioId(newScenario.id);
        alert('Scenario imported successfully!');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Failed to import scenario. Please check the CSV file format.');
      }
    });
  };

  const totalRevenues = useMemo(() => activeScenario.revenues.reduce((acc, item) => acc + item.total, 0), [activeScenario.revenues]);
  const totalCosts = useMemo(() => activeScenario.costs.reduce((acc, item) => acc + item.total, 0), [activeScenario.costs]);
  const netProfit = useMemo(() => totalRevenues - totalCosts, [totalRevenues, totalCosts]);
  const profitMargin = useMemo(() => {
    if (totalRevenues === 0) return 0;
    return (netProfit / totalRevenues) * 100;
  }, [netProfit, totalRevenues]);

  const perAthleteStats = useMemo(() => {
    const participantItem = activeScenario.revenues.find(item => item.name.toLowerCase().includes('participant'));
    const numberOfAthletes = participantItem ? participantItem.quantity : 1;
    const revenuePerAthlete = totalRevenues / numberOfAthletes;
    const costPerAthlete = totalCosts / numberOfAthletes;
    const profitPerAthlete = netProfit / numberOfAthletes;
    return { numberOfAthletes, revenuePerAthlete, costPerAthlete, profitPerAthlete };
  }, [activeScenario.revenues, totalRevenues, totalCosts, netProfit]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-black text-white min-h-screen font-sans">
        <Header activeView={activeView} onSelectView={setActiveView} />
        {activeView === 'scenarios' ? (
          <>
            <ScenarioTabs 
              scenarios={scenarios} 
              activeScenarioId={activeScenarioId} 
              onSelectScenario={setActiveScenarioId} 
              onAddScenario={addScenario} 
              onRemoveScenario={removeScenario}
              onRenameScenario={renameScenario}
              onDuplicateScenario={duplicateScenario}
              onSaveScenarios={handleSave}
              onExportScenario={handleExport}
              onImportScenario={handleImport}
              onReorderScenarios={() => {}} // This is now handled by onDragEnd
            />
            <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2">
                <BudgetCategory title="Revenues" items={activeScenario.revenues} onUpdate={handleUpdate('revenues')} onAddItem={() => addItem('revenues')} onRemoveItem={removeItem('revenues')} />
                <BudgetCategory title="Costs" items={activeScenario.costs} onUpdate={handleUpdate('costs')} onAddItem={() => addItem('costs')} onRemoveItem={removeItem('costs')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Chart totalRevenues={totalRevenues} totalCosts={totalCosts} />
                  <CostPieChart costs={activeScenario.costs} />
                </div>
                <WaterfallChart scenario={activeScenario} />
              </div>
              <div className="sticky top-8">
                <Summary totalRevenues={totalRevenues} totalCosts={totalCosts} netProfit={netProfit} profitMargin={profitMargin} />
                <PerAthleteStats {...perAthleteStats} />
              </div>
            </main>
          </>
        ) : (
          <main className="p-4 md:p-8 max-w-7xl mx-auto">
            <SensitivityMatrix />
          </main>
        )}

      </div>
    </DragDropContext>
  );
}

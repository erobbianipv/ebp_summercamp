import { Scenario } from './types';
import papaparse from 'papaparse';

export const exportScenarioToCsv = (scenario: Scenario) => {
  const { name, revenues, costs } = scenario;

  const revenueData = revenues.map(item => ({
    Category: 'Revenue',
    Item: item.name,
    Quantity: item.quantity,
    'Unit Cost': item.unitCost,
    Total: item.total,
  }));

  const costData = costs.map(item => ({
    Category: 'Cost',
    Item: item.name,
    Quantity: item.quantity,
    'Unit Cost': item.unitCost,
    Total: item.total,
  }));

  const allData = [...revenueData, ...costData];

  const csv = papaparse.unparse(allData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${name.replace(/ /g, '_')}_budget.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

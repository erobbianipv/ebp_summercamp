export interface BudgetItem {
  id: number;
  name: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Scenario {
  id: number;
  name: string;
  costs: BudgetItem[];
  revenues: BudgetItem[];
}

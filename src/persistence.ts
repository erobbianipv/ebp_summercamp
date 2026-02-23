import { Scenario } from './types';

const SCENARIOS_STORAGE_KEY = 'vareseCampBudgetScenarios';


export const saveScenarios = (scenarios: Scenario[]): void => {
  try {
    const data = JSON.stringify(scenarios);
    localStorage.setItem(SCENARIOS_STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save scenarios to localStorage', error);
  }
};

export const loadScenarios = (defaultScenarios: Scenario[]): Scenario[] => {
  try {
    const data = localStorage.getItem(SCENARIOS_STORAGE_KEY);
    if (data) {
      const scenarios = JSON.parse(data);
      // Basic validation to ensure it's an array
      if (Array.isArray(scenarios)) {
        return scenarios;
      }
    }
    return defaultScenarios;
  } catch (error) {
    console.error('Failed to load scenarios from localStorage', error);
    return defaultScenarios;
  }
};

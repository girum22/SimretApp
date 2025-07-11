import { Budget, Expense, ExpenseCategory, Goal, IncomeSource } from '@/models/simretModels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SimretContextType {
  user: { name: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string } | null>>;
  incomeSources: IncomeSource[];
  setIncomeSources: React.Dispatch<React.SetStateAction<IncomeSource[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  categories: ExpenseCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ExpenseCategory[]>>;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}

const SimretContext = createContext<SimretContextType | undefined>(undefined);

export const SimretProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const [usr, inc, exp, goa, cat, bud] = await Promise.all([
          AsyncStorage.getItem('simret_user'),
          AsyncStorage.getItem('simret_incomeSources'),
          AsyncStorage.getItem('simret_expenses'),
          AsyncStorage.getItem('simret_goals'),
          AsyncStorage.getItem('simret_categories'),
          AsyncStorage.getItem('simret_budgets'),
        ]);
        if (usr) setUser(JSON.parse(usr));
        if (inc) setIncomeSources(JSON.parse(inc));
        if (exp) setExpenses(JSON.parse(exp));
        if (goa) setGoals(JSON.parse(goa));
        if (cat) {
          const parsed = JSON.parse(cat);
          setCategories(Array.isArray(parsed) ? parsed : []);
        } else {
          setCategories([]);
        }
        if (bud) setBudgets(JSON.parse(bud));
      } catch (e) { /* ignore */ }
    })();
  }, []);

  // Save to AsyncStorage on change
  useEffect(() => { AsyncStorage.setItem('simret_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { AsyncStorage.setItem('simret_incomeSources', JSON.stringify(incomeSources)); }, [incomeSources]);
  useEffect(() => { AsyncStorage.setItem('simret_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { AsyncStorage.setItem('simret_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { AsyncStorage.setItem('simret_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { AsyncStorage.setItem('simret_budgets', JSON.stringify(budgets)); }, [budgets]);

  return (
    <SimretContext.Provider value={{ user, setUser, incomeSources, setIncomeSources, expenses, setExpenses, goals, setGoals, categories, setCategories, budgets, setBudgets }}>
      {children}
    </SimretContext.Provider>
  );
};

export function useSimret() {
  const ctx = useContext(SimretContext);
  if (!ctx) throw new Error('useSimret must be used within a SimretProvider');
  return ctx;
}

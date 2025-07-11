// Data models for Simret budget planner and expense tracker

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  parentId?: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  description?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number; // Amount saved so far
  startDate: string; // ISO date string
  endDate?: string; // Optional, for open-ended or time-bound goals
  categoryId?: string; // Optional, if the goal is for a specific category (e.g., savings)
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string; // ISO date string
  endDate?: string; // Optional
}

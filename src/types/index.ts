/* eslint-disable no-unused-vars */
export interface ITransaction {
  id: number
  title: string
  type: string
  amount: number
  date: Date | string
  category: string
}

export interface ITransactions {
  transactions: ITransaction[]
  totalItems: number
}

export interface IMonthlyTransaction {
  id: number
  title: string
  amount: number
  category: string
  type: string
}

export interface IMonthlyTransactions {
  monthlyTransactions: IMonthlyTransaction[]
  totalItems: number
}

export interface IBudget {
  id: number
  amount: number
  category: string
}

export interface IBudgets {
  budgets: IBudget[]
  totalItems: number
}

export interface IBudgetHistoric {
  id: number
  amount: number
  category: string
  date: Date | string
}

export interface IBudgetHistorics {
  budgetHistorics: IBudgetHistoric[]
  totalItems: number
}

export interface ICategory {
  id: string
  deleted: boolean
}

export interface ICategories {
  categories: ICategory[]
  totalItems: number
}

export interface BaseContextType {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, string>;

  handleChangeSort: (newSortBy: string) => void;
  handleChangeOrder: (newOrder: 'asc' | 'desc') => void;
  handleChangeFilters: (newFilters: Record<string, string>) => void;
}

export interface BaseContextTypeWithPagination extends BaseContextType {
  totalItems: number;
  page: number;
  limit: number;
  handleChangePage: (newPage: number) => void;
  handleChangeLimit: (newLimit: number) => void;
}

export interface TableReportData {
  headers: string[]
  items: Array<{
    sr: number
    month: string
    income: number
    expense: number
    balance: number
  }>
}
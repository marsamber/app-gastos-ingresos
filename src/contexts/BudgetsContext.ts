/* eslint-disable no-unused-vars */
import { BaseContextType, IBudget, IBudgetHistoric, ITransaction } from '@/types/index'
import { createContext } from 'react'

export interface BudgetsContextType extends BaseContextType {
  transactions: ITransaction[] | null

  budgets: IBudget[] | IBudgetHistoric[] | null

  refreshBudgets: (page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc') => void
  refreshKey: number
}

const defaultValue: BudgetsContextType = {
  transactions: null,

  budgets: null,
  totalItems: 0,

  refreshBudgets: () => {},
  refreshKey: 0,

  page: 0,
  limit: 10,
  sortBy: 'category',
  sortOrder: 'asc',

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {}
}

export const BudgetsContext = createContext<BudgetsContextType>(defaultValue)

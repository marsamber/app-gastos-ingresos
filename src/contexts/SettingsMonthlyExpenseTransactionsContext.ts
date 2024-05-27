/* eslint-disable no-unused-vars */
import { BaseContextType, IMonthlyTransaction } from '@/types/index'
import { createContext } from 'react'

export interface SettingsMonthlyExpenseTransactionsContextType extends BaseContextType {
  monthlyTransactions: IMonthlyTransaction[] | null

  refreshMonthlyTransactions: (page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc') => void
  refreshKey: number
}

const defaultValue: SettingsMonthlyExpenseTransactionsContextType = {
  monthlyTransactions: null,
  totalItems: 0,

  refreshMonthlyTransactions: () => {},
  refreshKey: 0,

  page: 0,
  limit: 10,
  sortBy: 'title',
  sortOrder: 'asc',

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {}
}

export const SettingsMonthlyExpenseTransactionsContext =
  createContext<SettingsMonthlyExpenseTransactionsContextType>(defaultValue)
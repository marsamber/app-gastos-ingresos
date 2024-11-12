/* eslint-disable no-unused-vars */
import { BaseContextTypeWithPagination, IMonthlyTransaction } from '@/types/index'
import { createContext } from 'react'

export interface SettingsMonthlyExpenseTransactionsContextType extends BaseContextTypeWithPagination {
  monthlyTransactions: IMonthlyTransaction[] | null

  refreshMonthlyTransactions: (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    filters: Record<string, string>
  ) => void
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
  filters: {},

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {},
  handleChangeFilters: () => {}
}

export const SettingsMonthlyExpenseTransactionsContext =
  createContext<SettingsMonthlyExpenseTransactionsContextType>(defaultValue)

/* eslint-disable no-unused-vars */
import { BaseContextTypeWithPagination, ITransaction } from '@/types/index'
import { createContext } from 'react'

export interface TransactionsContextType extends BaseContextTypeWithPagination {
  transactions: ITransaction[] | null

  refreshTransactions: (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    type: 'income' | 'expense' | null,
    filters: Record<string, string>
  ) => void
  refreshKey: number

  type: 'income' | 'expense' | null
}

const defaultValue: TransactionsContextType = {
  transactions: null,
  totalItems: 0,

  refreshTransactions: () => {},
  refreshKey: 0,

  page: 0,
  limit: 10,
  sortBy: 'date',
  sortOrder: 'desc',
  type: null,
  filters: {},

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {},
  handleChangeFilters: () => {}
}

export const TransactionsContext = createContext<TransactionsContextType>(defaultValue)

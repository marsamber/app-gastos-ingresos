/* eslint-disable no-unused-vars */
import { ITransaction } from '@/types/index'
import { createContext } from 'react'

interface TransactionsContextType {
  transactions: ITransaction[] | null
  totalItems: number

  refreshTransactions: (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    type: 'income' | 'expense' | null
  ) => void
  refreshKey: number

  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  type: 'income' | 'expense' | null

  handleChangePage: (newPage: number) => void
  handleChangeLimit: (newLimit: number) => void
  handleChangeSort: (newSortBy: string) => void
  handleChangeOrder: (newOrder: 'asc' | 'desc') => void
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

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {}
}

export const TransactionsContext = createContext<TransactionsContextType>(defaultValue)

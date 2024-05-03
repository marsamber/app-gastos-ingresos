import { ITransaction } from '@/types/index'
import { createContext } from 'react'

interface TransactionContextType {
  refreshKey: number
  refreshTransactions: () => void
}

const defaultValue: TransactionContextType = {
  refreshKey: 0,
  refreshTransactions: () => {}
}

export const TransactionContext = createContext<TransactionContextType>(defaultValue)

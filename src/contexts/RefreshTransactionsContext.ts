import { createContext } from 'react'

interface RefreshTransactionsContextType {
  refreshKey: number
  refreshTransactions: () => void
}

const defaultValue: RefreshTransactionsContextType = {
  refreshKey: 0,
  refreshTransactions: () => {}
}

export const RefreshTransactionsContext = createContext<RefreshTransactionsContextType>(defaultValue)

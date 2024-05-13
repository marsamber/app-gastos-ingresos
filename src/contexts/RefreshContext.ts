import { createContext } from 'react'

interface RefreshContextType {
  refreshKeyTransactions: number
  refreshTransactions: () => void

  refreshKeyCategories: number
  refreshCategories: () => void
}

const defaultValue: RefreshContextType = {
  refreshKeyTransactions: 0,
  refreshTransactions: () => {},

  refreshKeyCategories: 0,
  refreshCategories: () => {}
}

export const RefreshContext = createContext<RefreshContextType>(defaultValue)

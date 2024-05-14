import { createContext } from 'react'

interface RefreshContextType {
  refreshKeyTransactions: number
  refreshTransactions: () => void

  refreshKeyCategories: number
  refreshCategories: () => void

  apiKey: string
}

const defaultValue: RefreshContextType = {
  refreshKeyTransactions: 0,
  refreshTransactions: () => {},

  refreshKeyCategories: 0,
  refreshCategories: () => {},

  apiKey: ''
}

export const RefreshContext = createContext<RefreshContextType>(defaultValue)

/* eslint-disable no-unused-vars */
import { createContext } from 'react'

interface RefreshContextType {
  refreshKeyTransactions?: number
  refreshTransactions?: () => void

  refreshKeyCategories?: number
  refreshCategories?: () => void

  refreshKeyBudgets?: number
  refreshBudgets?: () => void
}

const defaultValue: RefreshContextType = {
  refreshKeyTransactions: 0,
  refreshTransactions: () => {},

  refreshKeyCategories: 0,
  refreshCategories: () => {},

  refreshKeyBudgets: 0,
  refreshBudgets: () => {}
}

export const RefreshContext = createContext<RefreshContextType>(defaultValue)

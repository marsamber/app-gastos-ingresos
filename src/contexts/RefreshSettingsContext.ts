import { createContext } from 'react'

interface RefreshSettingsContextType {
  refreshKeyMonthlyTransactions: number
  refreshMonthlyTransactions: () => void
  refreshKeyCategories: number
  refreshCategories: () => void
  refreshKeyBudgets: number
  refreshBudgets: () => void
}

const defaultValue: RefreshSettingsContextType = {
  refreshKeyMonthlyTransactions: 0,
  refreshMonthlyTransactions: () => {},
  refreshKeyCategories: 0,
  refreshCategories: () => {},
  refreshKeyBudgets: 0,
  refreshBudgets: () => {}
}

export const RefreshSettingsContext = createContext<RefreshSettingsContextType>(defaultValue)

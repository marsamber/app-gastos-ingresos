import { createContext } from 'react'

interface RefreshSettingsContextType {
  refreshKeyBudgets: number
  refreshBudgets: () => void
}

const defaultValue: RefreshSettingsContextType = {
  refreshKeyBudgets: 0,
  refreshBudgets: () => {}
}

export const RefreshSettingsContext = createContext<RefreshSettingsContextType>(defaultValue)

/* eslint-disable no-unused-vars */
import { createContext } from 'react'

interface RefreshContextType {
  refreshKeyTransactions: number
  refreshTransactions: () => void

  refreshKeyCategories: number
  refreshCategories: () => void

  apiKey: string
  updateApiKey: (apiKey: string) => void
}

const defaultValue: RefreshContextType = {
  refreshKeyTransactions: 0,
  refreshTransactions: () => {},

  refreshKeyCategories: 0,
  refreshCategories: () => {},

  apiKey: '',
  updateApiKey: () => {}
}

export const RefreshContext = createContext<RefreshContextType>(defaultValue)

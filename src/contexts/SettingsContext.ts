import { IBudget, IMonthlyTransaction } from '@/types/index'
import { createContext } from 'react'

interface SettingsContextType {
  loadingMonthlyTransactions: boolean
  monthlyTransactions: IMonthlyTransaction[]
  loadingCategories: boolean
  categories: string[]
  loadingBudgets: boolean
  budgets: IBudget[]
  monthSelected: string
}

const defaultValue: SettingsContextType = {
  loadingMonthlyTransactions: true,
  monthlyTransactions: [],
  loadingCategories: true,
  categories: [],
  loadingBudgets: true,
  budgets: [],
  monthSelected: ''
}

export const SettingsContext = createContext<SettingsContextType>(defaultValue)

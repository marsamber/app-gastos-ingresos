/* eslint-disable no-unused-vars */
import { IBudget, IBudgetHistoric, IMonthlyTransaction } from '@/types/index'
import { createContext } from 'react'

interface SettingsContextType {
  loadingMonthlyTransactions: boolean
  monthlyTransactions: IMonthlyTransaction[]
  loadingCategories: boolean
  categories: string[]
  loadingBudgets: boolean
  budgets: IBudget[]
  monthSelected: string

  addMonthlyTransaction: (monthlyTransaction: IMonthlyTransaction) => void
  editMonthlyTransaction: (monthlyTransaction: IMonthlyTransaction) => void

  addBudget: (budget: IBudget | IBudgetHistoric) => void
  editBudget: (budget: IBudget | IBudgetHistoric) => void
  deleteBudget: (id: number) => void

  deleteCategory: (category: string) => void
}

const defaultValue: SettingsContextType = {
  loadingMonthlyTransactions: true,
  monthlyTransactions: [],
  loadingCategories: true,
  categories: [],
  loadingBudgets: true,
  budgets: [],
  monthSelected: '',

  addMonthlyTransaction: () => {},
  editMonthlyTransaction: () => {},

  addBudget: () => {},
  editBudget: () => {},
  deleteBudget: () => {},

  deleteCategory: () => {}
}

export const SettingsContext = createContext<SettingsContextType>(defaultValue)

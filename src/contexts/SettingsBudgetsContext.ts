/* eslint-disable no-unused-vars */
import { BaseContextType, IBudget, IBudgetHistoric } from '@/types/index'
import { createContext } from 'react'

export interface SettingsBudgetsContextType extends BaseContextType {
  budgets: IBudget[] | IBudgetHistoric[] | null
  monthSelected: string

  refreshBudgets: (sortBy: string, sortOrder: 'asc' | 'desc', filters: Record<string, string>) => void
  refreshKey: number
}

const defaultValue: SettingsBudgetsContextType = {
  budgets: null,
  monthSelected: '',

  refreshBudgets: () => {},
  refreshKey: 0,

  sortBy: 'category',
  sortOrder: 'asc',
  filters: {},

  handleChangeSort: () => {},
  handleChangeOrder: () => {},
  handleChangeFilters: () => {}
}

export const SettingsBudgetsContext = createContext<SettingsBudgetsContextType>(defaultValue)

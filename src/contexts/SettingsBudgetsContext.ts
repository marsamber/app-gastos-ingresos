/* eslint-disable no-unused-vars */
import { BaseContextType, IBudget, IBudgetHistoric } from '@/types/index'
import { createContext } from 'react'

export interface SettingsBudgetsContextType extends BaseContextType {
  budgets: IBudget[] | IBudgetHistoric[] | null
  monthSelected: string

  refreshBudgets: (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    filters: Record<string, string>
  ) => void
  refreshKey: number
}

const defaultValue: SettingsBudgetsContextType = {
  budgets: null,
  monthSelected: '',
  totalItems: 0,

  refreshBudgets: () => {},
  refreshKey: 0,

  page: 0,
  limit: 15,
  sortBy: 'category',
  sortOrder: 'asc',
  filters: {},

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {},
  handleChangeFilters: () => {}
}

export const SettingsBudgetsContext = createContext<SettingsBudgetsContextType>(defaultValue)

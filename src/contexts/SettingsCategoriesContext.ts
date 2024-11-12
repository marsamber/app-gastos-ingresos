/* eslint-disable no-unused-vars */
import { BaseContextType } from '@/types/index'
import { createContext } from 'react'

export interface SettingsCategoriesContextType extends BaseContextType {
  categories: string[] | null

  refreshCategories: (sortBy: string, sortOrder: 'asc' | 'desc', filters: Record<string, string>) => void
  refreshKey: number
}

const defaultValue: SettingsCategoriesContextType = {
  categories: null,

  refreshCategories: () => {},
  refreshKey: 0,

  sortBy: 'id',
  sortOrder: 'asc',
  filters: {},

  handleChangeSort: () => {},
  handleChangeOrder: () => {},
  handleChangeFilters: () => {}
}

export const SettingsCategoriesContext = createContext<SettingsCategoriesContextType>(defaultValue)

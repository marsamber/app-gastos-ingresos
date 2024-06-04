/* eslint-disable no-unused-vars */
import { BaseContextType } from '@/types/index'
import { createContext } from 'react'

export interface SettingsCategoriesContextType extends BaseContextType {
  categories: string[] | null

  refreshCategories: (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    filters: Record<string, string>
  ) => void
  refreshKey: number
}

const defaultValue: SettingsCategoriesContextType = {
  categories: null,
  totalItems: 0,

  refreshCategories: () => {},
  refreshKey: 0,

  page: 0,
  limit: 15,
  sortBy: 'id',
  sortOrder: 'asc',
  filters: {},

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {},
  handleChangeFilters: () => {}
}

export const SettingsCategoriesContext = createContext<SettingsCategoriesContextType>(defaultValue)

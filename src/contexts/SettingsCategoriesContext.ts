/* eslint-disable no-unused-vars */
import { BaseContextType } from '@/types/index'
import { createContext } from 'react'

export interface SettingsCategoriesContextType extends BaseContextType {
  categories: string[] | null

  refreshCategories: (page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc') => void
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

  handleChangePage: () => {},
  handleChangeLimit: () => {},
  handleChangeSort: () => {},
  handleChangeOrder: () => {}
}

export const SettingsCategoriesContext = createContext<SettingsCategoriesContextType>(defaultValue)

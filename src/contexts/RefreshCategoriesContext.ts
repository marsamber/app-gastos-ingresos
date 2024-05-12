import { createContext } from 'react'

interface CategoriesContextType {
  categories: string[]
  loadingCategories: boolean
}

const defaultValue: CategoriesContextType = {
  categories: [],
  loadingCategories: true
}

export const CategoriesContext = createContext<CategoriesContextType>(defaultValue)

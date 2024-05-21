export interface ITransaction {
  id: number
  title: string
  amount: number
  date: Date | string
  category: string
}

export interface ITransactions {
  transactions: ITransaction[]
  totalItems: number
}

export interface IMonthlyTransaction {
  id: number
  title: string
  amount: number
  category: string
  type: 'income' | 'expense'
}

export interface IMonthlyTransactions {
  monthlyTransactions: IMonthlyTransaction[]
  totalItems: number
}

export interface IBudget {
  id: number
  amount: number
  category: string
}

export interface IBudgets {
  budgets: IBudget[]
  totalItems: number
}

export interface IBudgetHistoric {
  id: number
  amount: number
  category: string
  date: Date | string
}

export interface IBudgetHistorics {
  budgetHistorics: IBudgetHistoric[]
  totalItems: number
}

export interface ICategory {
  id: string
  deleted: boolean
}

export interface ICategories {
  categories: ICategory[]
  totalItems: number
}

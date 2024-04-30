export interface ITransaction {
  id: number
  title: string
  amount: number
  date: Date | string
  category: string
}

export interface IBudget {
  id: number
  amount: number
  category: string
}

export interface IBudgetHistoric {
  id: number
  amount: number
  category: string
  date: Date | string
}

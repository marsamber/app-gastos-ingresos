import { CircularProgress, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneCategoryCard from '../card/OneCategoryCard'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { HomeContext } from '@/contexts/HomeContext'

interface MonthBudgetTable {
  id: string
  category: string
  spent: number
  remaining: number
  total: number
}

export default function MonthBudgetTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { transactions, loadingTransactions, budgets, loadingBudgets } = useContext(HomeContext)
  const [rows, setRows] = useState<MonthBudgetTable[]>([])

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'spent', label: 'Gastado' },
    { id: 'remaining', label: 'Restante' },
    { id: 'total', label: 'Presupuestado' }
  ]

  useEffect(() => {
    let data: MonthBudgetTable[] = []

    if (budgets) {
      budgets
        .filter(budget => budget.category !== 'Ingresos fijos')
        .forEach(budget => {
          data.push({
            id: budget.category,
            category: budget.category,
            spent: 0,
            remaining: budget.amount,
            total: budget.amount
          })
        })
    }

    if (transactions) {
      transactions
        .filter(budget => budget.category !== 'Ingresos fijos')
        .forEach(transaction => {
          const index = data.findIndex(d => d.id === transaction.category)
          if (index !== -1) {
            data[index].spent -= transaction.amount
            data[index].remaining += transaction.amount
          }
        })
    }

    setRows(data)
  }, [transactions, budgets])

  // STYLES
  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <>
      {(loadingTransactions || loadingBudgets) && <CircularProgress style={circularProgressStyle} />}
      {!isMobile && !loadingTransactions && transactions && !loadingBudgets && budgets && (
        <BasicTable headCells={headCells} rows={rows} keyOrder="category" numRowsPerPage={10} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          !loadingTransactions &&
          transactions &&
          !loadingBudgets &&
          budgets &&
          rows.sort((a, b) => (a.category > b.category ? 1 : -1)).map(row => <OneCategoryCard data={row} />)}
      </div>
    </>
  )
}

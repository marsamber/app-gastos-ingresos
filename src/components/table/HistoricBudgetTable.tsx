import { CircularProgress, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneCategoryCard from '../card/OneCategoryCard'
import { HomeContext } from '@/contexts/HomeContext'
import { CSSProperties, useContext, useEffect, useState } from 'react'

interface HistoricBudgetTableData {
  id: string
  category: string
  spent: number
  remaining: number
  total: number
}

export default function HistoricBudgetTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { transactions, loadingTransactions, budgets, loadingBudgets, budgetHistorics, loadingBudgetHistorics } = useContext(HomeContext)
  const [rows, setRows] = useState<HistoricBudgetTableData[]>([])

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'spent', label: 'Gastado' },
    { id: 'remaining', label: 'Restante' },
    { id: 'total', label: 'Total' }
  ]
  
  useEffect(() => {
    let data: HistoricBudgetTableData[] = []

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

    if (budgetHistorics) {
      budgetHistorics
        .filter(budget => budget.category !== 'Ingresos fijos')
        .forEach(historic => {
          const index = data.findIndex(d => d.id === historic.category)
          if (index !== -1) {
            data[index].remaining += historic.amount
            data[index].total += historic.amount
          } else {
            data.push({
              id: historic.category,
              category: historic.category,
              spent: 0,
              remaining: historic.amount,
              total: historic.amount
            })
          }
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
  }, [transactions, budgets, budgetHistorics])
  
  // STYLES
  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <>
      {(loadingTransactions || loadingBudgets || loadingBudgetHistorics) && (
        <CircularProgress style={circularProgressStyle} />
      )}
      {!isMobile &&
        !loadingTransactions &&
        transactions &&
        !loadingBudgets &&
        budgets &&
        !loadingBudgetHistorics &&
        budgetHistorics && <BasicTable headCells={headCells} rows={rows} keyOrder="category" numRowsPerPage={10} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          !loadingTransactions &&
          transactions &&
          !loadingBudgets &&
          budgets &&
          !loadingBudgetHistorics &&
          budgetHistorics &&
          rows.sort((a, b) => (a.category > b.category ? 1 : -1)).map(row => <OneCategoryCard key={row.id} data={row} />)}
      </div>
    </>
  )
}

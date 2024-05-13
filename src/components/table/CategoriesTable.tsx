/* eslint-disable no-unused-vars */
import { SettingsContext } from '@/contexts/SettingsContext'
import { Delete, Edit } from '@mui/icons-material'
import { CircularProgress, IconButton, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import OneCategoryBudgetCard from '../card/OneCategoryBudgetCard'
import BasicTable from './BasicTable'

interface CategoriesTableProps {
  handleEditCategoryBudget: (id: number) => void
  handleDeleteCategoryBudget: (id: number) => void
}

export default function CategoriesTable({
  handleEditCategoryBudget,
  handleDeleteCategoryBudget
}: CategoriesTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { budgets, loadingBudgets } = useContext(SettingsContext)
  const [rows, setRows] = useState<any[]>([])

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'budget', label: 'Presupuesto' },
    { id: 'actions', label: 'Acciones' }
  ]

  // DATA
  useEffect(() => {
    if (!budgets) return
    const rows = budgets.map(budget => ({
      id: budget.id,
      category: budget.category,
      budget: budget.amount,
      actions: (
        <div key={budget.id}>
          <IconButton onClick={() => handleEditCategoryBudget(budget.id)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDeleteCategoryBudget(budget.id)}>
            <Delete color="primary" />
          </IconButton>
        </div>
      )
    }))

    rows.sort((a, b) => a.category.localeCompare(b.category))

    setRows(rows)
  }, [budgets])

  // STYLES
  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <>
      {loadingBudgets ? (
        <div style={circularProgressStyle}>
          <CircularProgress />
        </div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(row => (
            <OneCategoryBudgetCard key={row.id} data={row} />
          ))}{' '}
        </div>
      ) : (
        <BasicTable headCells={headCells} rows={rows} keyOrder="date" orderDirection="asc" numRowsPerPage={15} />
      )}
    </>
  )
}

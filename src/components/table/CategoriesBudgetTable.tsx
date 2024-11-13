/* eslint-disable no-unused-vars */
import { SettingsBudgetsContext } from '@/contexts/SettingsBudgetsContext'
import { Delete, Edit } from '@mui/icons-material'
import { IconButton, useMediaQuery } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import OneCategoryBudgetCard from '../card/OneCategoryBudgetCard'
import BasicTable from './BasicTable'

interface CategoriesBudgetTableProps {
  handleEditCategoryBudget: (id: number) => void
  handleDeleteCategoryBudget: (id: number) => void
}

interface CategoriesBudgetTableData {
  id: number
  category: string
  budget: number
  actions: JSX.Element
  [key: string]: unknown
}

export default function CategoriesBudgetTable({
  handleEditCategoryBudget,
  handleDeleteCategoryBudget
}: CategoriesBudgetTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { budgets } = useContext(SettingsBudgetsContext)
  const [rows, setRows] = useState<CategoriesBudgetTableData[]>([])

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
          {budget.category !== 'Ingresos fijos' && (
            <>
              <IconButton onClick={() => handleEditCategoryBudget(budget.id)}>
                <Edit color="primary" />
              </IconButton>
              <IconButton onClick={() => handleDeleteCategoryBudget(budget.id)}>
                <Delete color="primary" />
              </IconButton>
            </>
          )}
        </div>
      )
    }))

    setRows(rows)
  }, [budgets])

  return (
    <>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(row => (
            <OneCategoryBudgetCard key={row.id} data={row} />
          ))}
        </div>
      ) : (
        <BasicTable<CategoriesBudgetTableData> headCells={headCells} rows={rows} type="settingsBudgets" />
      )}
    </>
  )
}

/* eslint-disable no-unused-vars */
import { SettingsContext } from '@/contexts/SettingsContext'
import { Add } from '@mui/icons-material'
import { Button, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useState } from 'react'
import AddCategoryBudgetModal from '../modal/AddCategoryBudgetModal'
import EditCategoryBudgetModal from '../modal/EditCategoryBudgetModal'
import CategoriesTable from '../table/CategoriesTable'
import BasicCard from './BasicCard'
import { IBudget } from '@/types/index'
import DeleteCategoryBudgetModal from '../modal/DeleteCategoryBudgetModal'
import MonthPicker from '../MonthPicker'

interface CategoriesCardProps {
  setMonthSelected: (month: string) => void
}

export default function CategoriesCard({ setMonthSelected }: CategoriesCardProps) {
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 500px)')
  const [addCategoryBudget, setAddCategoryBudget] = useState(false)
  const [editCategoryBudget, setEditCategoryBudget] = useState(false)
  const [deleteCategoryBudget, setDeleteCategoryBudget] = useState(false)
  const [categoryBudget, setCategoryBudget] = useState<IBudget | null>(null)

  const { budgets } = useContext(SettingsContext)

  const handleEditCategoryBudget = (id: number) => {
    const categoryBudget = budgets.find(budget => budget.id === id)
    setCategoryBudget(categoryBudget!)
    setEditCategoryBudget(true)
  }

  const handleDeleteCategoryBudget = (id: number) => {
    const categoryBudget = budgets.find(budget => budget.id === id)
    setCategoryBudget(categoryBudget!)
    setDeleteCategoryBudget(true)
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0',
    width: isMobile ? '60%' : 'unset',
  }

  const cardStyle = {
    width: '100%',
    height: isTablet ? 'auto' : '100%'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  }

  return (
    <BasicCard style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <span>Presupuesto por categorías - </span>
          <MonthPicker setMonthSelected={setMonthSelected} />
        </h3>
        <Button variant="contained" color="primary" endIcon={<Add />} onClick={() => setAddCategoryBudget(true)}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <CategoriesTable
          handleEditCategoryBudget={handleEditCategoryBudget}
          handleDeleteCategoryBudget={handleDeleteCategoryBudget}
        />
      </div>
      <AddCategoryBudgetModal open={addCategoryBudget} handleClose={() => setAddCategoryBudget(false)} />
      <EditCategoryBudgetModal
        open={editCategoryBudget}
        handleClose={() => setEditCategoryBudget(false)}
        categoryBudget={categoryBudget}
      />
      <DeleteCategoryBudgetModal
        open={deleteCategoryBudget}
        handleClose={() => setDeleteCategoryBudget(false)}
        categoryBudget={categoryBudget}
      />
    </BasicCard>
  )
}

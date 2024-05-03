import { CSSProperties, useState } from 'react'
import BasicCard from './BasicCard'
import { Button, useMediaQuery } from '@mui/material'
import { Add } from '@mui/icons-material'
import CategoriesTable from '../table/CategoriesTable'
import AddCategoryBudgetModal from '../modal/AddCategoryBudgetModal'

export default function CategoriesCard() {
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [addCategoryBudget, setAddCategoryBudget] = useState(false)

  // STYLES
  const titleStyle = {
    margin: '10px 0'
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
        <h3 style={titleStyle}>Presupuesto por categorías</h3>
        <Button variant="contained" color="primary" endIcon={<Add />}
        onClick={() => setAddCategoryBudget(true)}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <CategoriesTable />
      </div>
      <AddCategoryBudgetModal
        open={addCategoryBudget}
        handleClose={() => setAddCategoryBudget(false)}
        />
    </BasicCard>
  )
}

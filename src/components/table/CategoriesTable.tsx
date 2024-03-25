import { useMediaQuery } from '@mui/material'
import CustomizedTable from './CustomizedTable'
import OneCategoryBudgetCard from '../card/OneCategoryBudgetCard'

export default function CategoriesTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'description', label: 'Descripción' },
    { id: 'budget', label: 'Presupuesto' }
  ]

  const rows = [
    { id: 0, description: 'Comida', budget: 300 },
    { id: 1, description: 'Ocio', budget: 100 },
    { id: 2, description: 'Transporte', budget: 50 },
    { id: 3, description: 'Ropa', budget: 50 },
    { id: 4, description: 'Salud', budget: 50 },
    { id: 5, description: 'Hogar', budget: 50 },
    { id: 6, description: 'Educación', budget: 50 },
    { id: 7, description: 'Regalos', budget: 50 },
    { id: 8, description: 'Viajes', budget: 50 },
    { id: 9, description: 'Ahorro', budget: 50 },
    { id: 10, description: 'Otros', budget: 50 }
  ]

  return (
    <>
      {!isMobile && <CustomizedTable headCells={headCells} rows={rows} keyOrder="date" numRowsPerPage={15} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          rows
            .map(row => <OneCategoryBudgetCard data={row} />)}
      </div>
    </>
  )
}

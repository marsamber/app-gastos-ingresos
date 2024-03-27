import { IconButton, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneCategoryBudgetCard from '../card/OneCategoryBudgetCard'
import { Delete, Edit } from '@mui/icons-material'

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

  headCells.push({ id: 'actions', label: 'Acciones' })
  const dataRows = rows.map(row => ({
    ...row,
    actions: (
      <div key={row.id}>
        <IconButton>
          <Edit color='error' />
        </IconButton>
        <IconButton>
          <Delete color='error' />
        </IconButton>
      </div>
    )
  }))

  return (
    <>
      {!isMobile && <BasicTable headCells={headCells} rows={dataRows} keyOrder="date" numRowsPerPage={15} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          dataRows
            .map(row => <OneCategoryBudgetCard data={row} />)}
      </div>
    </>
  )
}

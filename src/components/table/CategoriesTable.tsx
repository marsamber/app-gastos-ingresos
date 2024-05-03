import { IconButton, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneCategoryBudgetCard from '../card/OneCategoryBudgetCard'
import { Delete, Edit } from '@mui/icons-material'

export default function CategoriesTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'budget', label: 'Presupuesto' }
  ]

  const rows = [
    { id: 0, category: 'Comida', budget: 300 },
    { id: 1, category: 'Ocio', budget: 100 },
    { id: 2, category: 'Transporte', budget: 50 },
    { id: 3, category: 'Ropa', budget: 50 },
    { id: 4, category: 'Salud', budget: 50 },
    { id: 5, category: 'Hogar', budget: 50 },
    { id: 6, category: 'Educación', budget: 50 },
    { id: 7, category: 'Regalos', budget: 50 },
    { id: 8, category: 'Viajes', budget: 50 },
    { id: 9, category: 'Ahorro', budget: 50 },
    { id: 10, category: 'Otros', budget: 50 }
  ]

  headCells.push({ id: 'actions', label: 'Acciones' })
  const dataRows = rows.map(row => ({
    ...row,
    actions: (
      <div key={row.id}>
        <IconButton>
          <Edit color="primary" />
        </IconButton>
        <IconButton>
          <Delete color="primary" />
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

import { useMediaQuery } from '@mui/material'
import CustomizedTable from './CustomizedTable'
import OneCategoryCard from './OneCategoryCard'


export default function MonthBudgetTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'spent', label: 'Gastado' },
    { id: 'remaining', label: 'Restante' },
    { id: 'total', label: 'Total' }
  ]

const rows = [
    {
        id: 1,
        category: 'Compras varias',
        spent: 400,
        remaining: 100,
        total: 500
    },
    {
        id: 2,
        category: 'Alimentación',
        spent: 300,
        remaining: 200,
        total: 500
    },
    {
        id: 3,
        category: 'Restaurantes',
        spent: 300,
        remaining: 200,
        total: 500
    },
    {
        id: 4,
        category: 'Gastos inesperados',
        spent: 200,
        remaining: 300,
        total: 500
    },
    {
        id: 5,
        category: 'Ocio',
        spent: 100,
        remaining: 400,
        total: 500
    },
    {
        id: 6,
        category: 'Transporte',
        spent: 100,
        remaining: 400,
        total: 500
    },
    {
        id: 7,
        category: 'Salud',
        spent: 100,
        remaining: 400,
        total: 500
    }
]

  return (
    <>
      {!isMobile && <CustomizedTable headCells={headCells} rows={rows} keyOrder="category" numRowsPerPage={10} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          rows
            .sort((a, b) => a.category > b.category ? 1 : -1)
            .map(row => <OneCategoryCard data={row} />)}
      </div>
    </>
  )
}

import { useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneCategoryCard from '../card/OneCategoryCard'


export default function HistoricBudgetTable() {
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
    spent: 4000,
    remaining: 1000,
    total: 5000
  },
  {
    id: 2,
    category: 'Alimentación',
    spent: 3000,
    remaining: 2000,
    total: 5000
  },
  {
    id: 3,
    category: 'Restaurantes',
    spent: 3000,
    remaining: 2000,
    total: 5000
  },
  {
    id: 4,
    category: 'Gastos inesperados',
    spent: 2000,
    remaining: 3000,
    total: 5000
  },
  {
    id: 5,
    category: 'Ocio',
    spent: 1000,
    remaining: 4000,
    total: 5000
  },
  {
    id: 6,
    category: 'Transporte',
    spent: 1000,
    remaining: 4000,
    total: 5000
  },
  {
    id: 7,
    category: 'Salud',
    spent: 1000,
    remaining: 4000,
    total: 5000
  }
]

  return (
    <>
      {!isMobile && <BasicTable headCells={headCells} rows={rows} keyOrder="category" numRowsPerPage={10} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          rows
            .sort((a, b) => a.category > b.category ? 1 : -1)
            .map(row => <OneCategoryCard data={row} />)}
      </div>
    </>
  )
}

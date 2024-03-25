import { useMediaQuery } from '@mui/material'
import CustomizedTable from './CustomizedTable'
import OneTransactionCard from '../card/OneTransactionCard'

export interface IncomesTableProps {
    filter?: string
}

export default function IncomesTable({filter = 'this_month'}: IncomesTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'description', label: 'Descripción' },
    { id: 'category', label: 'Categoría' },
    { id: 'date', label: 'Fecha' },
    { id: 'amount', label: 'Cantidad' }
  ]

  const rows = [
    { id: 10, description: 'Nómina', category: 'Nómina', date: new Date(2023, 3, 23), amount: 3000 },
    { id: 11, description: 'Ingreso de alquiler', category: 'Ingresos', date: new Date(2023, 3, 23), amount: 500 },
    { id: 12, description: 'Ingreso de ventas', category: 'Ingresos', date: new Date(2023, 3, 23), amount: 1000 },
    { id: 13, description: 'Ingreso de intereses', category: 'Ingresos', date: new Date(2023, 3, 23), amount: 200 }
  ]

  return (
    <>
      {!isMobile && <CustomizedTable headCells={headCells} rows={rows} keyOrder="date" numRowsPerPage={10} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          rows
            .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
            .map(row => <OneTransactionCard data={row} />)}
      </div>
    </>
  )
}

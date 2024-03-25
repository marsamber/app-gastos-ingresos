import { useMediaQuery } from '@mui/material'
import CustomizedTable from './CustomizedTable'
import OneTransactionCard from '../card/OneTransactionCard'

export interface AllTransactionsTableProps {
    filter?: string
}

export default function AllTransactionsTable({filter = 'this_month'}: AllTransactionsTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'description', label: 'Descripción' },
    { id: 'category', label: 'Categoría' },
    { id: 'date', label: 'Fecha' },
    { id: 'amount', label: 'Cantidad' }
  ]

  const rows = [
    { id: 1, description: 'Compra en Amazon', category: 'Compras', date: new Date(2023, 3, 23), amount: -1500 },
    { id: 2, description: 'Compra en Zara', category: 'Compras', date: new Date(2023, 3, 28), amount: -1000 },
    {
      id: 3,
      description: 'Compra en El Corte Inglés',
      category: 'Compras',
      date: new Date(2023, 3, 23),
      amount: -1800
    },
    { id: 4, description: 'Compra en MediaMarkt', category: 'Compras', date: new Date(2023, 3, 20), amount: -2000 },
    { id: 5, description: 'Compra en Fnac', category: 'Compras', date: new Date(2023, 3, 23), amount: -2500 },
    { id: 6, description: 'Compra en Carrefour', category: 'Compras', date: new Date(2023, 3, 23), amount: -3000 },
    { id: 7, description: 'Compra en Decathlon', category: 'Compras', date: new Date(2023, 3, 30), amount: -2800 },
    {
      id: 8,
      description: 'Compra en Leroy Merlin',
      category: 'Compras',
      date: new Date(2023, 3, 23),
      amount: -2020
    },
    { id: 9, description: 'Compra en Ikea', category: 'Compras', date: new Date(2023, 3, 23), amount: -1800 },
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

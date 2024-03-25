import { useMediaQuery } from '@mui/material'
import CustomizedTable from './CustomizedTable'
import OneTransactionCard from '../card/OneTransactionCard'
import OneFixedTransactionCard from '../card/OneFixedTransactionCard'

export default function FixedOutcomesTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'description', label: 'Descripción' },
    { id: 'amount', label: 'Cantidad' }
  ]

  const rows = [
    { id: 0, description: 'Hipoteca', amount: -500 },
    { id: 1, description: 'Seguro de coche', amount: -50 },
    { id: 2, description: 'Luz', amount: -30 },
    { id: 3, description: 'Agua', amount: -20 },
    { id: 4, description: 'Internet', amount: -30 }
  ]

  return (
    <>
      {!isMobile && <CustomizedTable headCells={headCells} rows={rows} keyOrder="date" numRowsPerPage={5} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          rows
            .map(row => <OneFixedTransactionCard data={row} />)}
      </div>
    </>
  )
}

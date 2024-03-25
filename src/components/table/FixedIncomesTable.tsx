import { useMediaQuery } from '@mui/material'
import CustomizedTable from './CustomizedTable'
import OneTransactionCard from '../card/OneTransactionCard'
import OneFixedTransactionCard from '../card/OneFixedTransactionCard'

export default function FixedIncomesTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'description', label: 'Descripción' },
    { id: 'amount', label: 'Cantidad' }
  ]

  const rows = [
    { id: 0, description: 'Nómina Laur', amount: 5000 },
    { id: 1, description: 'Nómina Marta', amount: 2300 },
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

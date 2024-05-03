import { Button, IconButton, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneFixedTransactionCard from '../card/OneFixedTransactionCard'
import { Delete, Edit } from '@mui/icons-material'

export default function FixedIncomesTable() {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const headCells = [
    { id: 'description', label: 'Descripción' },
    { id: 'amount', label: 'Cantidad' }
  ]

  const rows = [
    { id: 0, description: 'Nómina Laur', amount: 5000 },
    { id: 1, description: 'Nómina Marta', amount: 2300 }
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
      {!isMobile && <BasicTable headCells={headCells} rows={dataRows} keyOrder="date" numRowsPerPage={5} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile && dataRows.map(row => <OneFixedTransactionCard data={row} />)}
      </div>
    </>
  )
}

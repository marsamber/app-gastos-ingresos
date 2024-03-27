import { IconButton, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneFixedTransactionCard from '../card/OneFixedTransactionCard'
import { Delete, Edit } from '@mui/icons-material'

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
      {!isMobile && <BasicTable headCells={headCells} rows={dataRows} keyOrder="date" numRowsPerPage={5} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          dataRows
            .map(row => <OneFixedTransactionCard data={row} />)}
      </div>
    </>
  )
}

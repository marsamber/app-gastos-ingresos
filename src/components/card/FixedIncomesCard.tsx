import { CSSProperties, useState } from 'react'
import BasicCard from './BasicCard'
import { Button, useMediaQuery } from '@mui/material'
import { Add } from '@mui/icons-material'
import FixedIncomesTable from '../table/FixedIncomesTable'
import AddFixedTransactionModal from '../modal/AddFixedTransactionModal'

export default function FixedIncomesCard() {
  const [addFixedIncomeTransaction, setAddFixedIncomeTransaction] = useState(false)

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const cardStyle = {
    width: '100%'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  }

  return (
    <BasicCard style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Ingresos fijos</h3>
        <Button variant="contained" color="primary" endIcon={<Add />} onClick={() => setAddFixedIncomeTransaction(true)}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <FixedIncomesTable />
      </div>
      <AddFixedTransactionModal
        open={addFixedIncomeTransaction}
        handleClose={() => setAddFixedIncomeTransaction(false)}
        transactionType="income"
      />
    </BasicCard>
  )
}

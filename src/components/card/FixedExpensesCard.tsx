import { CSSProperties, useState } from 'react'
import BasicCard from './BasicCard'
import { Button, useMediaQuery } from '@mui/material'
import { Add } from '@mui/icons-material'
import FixedExpensesTable from '../table/FixedExpensesTable'
import AddFixedTransactionModal from '../modal/AddFixedTransactionModal'

export default function FixedExpensesCard() {
  const [addFixedExpenseTransaction, setAddFixedExpenseTransaction] = useState(false)

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
        <h3 style={titleStyle}>Gastos fijos</h3>
        <Button variant="contained" color="error" endIcon={<Add />}
        onClick={() => setAddFixedExpenseTransaction(true)}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <FixedExpensesTable />
      </div>
      <AddFixedTransactionModal
        open={addFixedExpenseTransaction}
        handleClose={() => setAddFixedExpenseTransaction(false)}
        transactionType="expense"/>
    </BasicCard>
  )
}

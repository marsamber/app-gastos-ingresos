/* eslint-disable no-unused-vars */
import { SettingsContext } from '@/contexts/SettingsContext'
import { IMonthlyTransaction } from '@/types/index'
import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { CSSProperties, useContext, useState } from 'react'
import FixedTransactionModal from '../modal/FixedTransactionModal'
import FixedTransactionsTable from '../table/FixedTransactionsTable'
import BasicCard from './BasicCard'

interface FixedTransactionsCardProps {
  handleDeleteMonthlyTransaction: (id: number) => void
  transactionType: 'income' | 'expense'
}

export default function FixedTransactionsCard({
  handleDeleteMonthlyTransaction,
  transactionType
}: FixedTransactionsCardProps) {
  const [openTransactionModal, setOpenTransactionModal] = useState(false)
  const [editTransactionModal, setEditTransactionModal] = useState(false)
  const [monthlyTransaction, setMonthlyTransaction] = useState<IMonthlyTransaction | null>(null)
  const { monthlyTransactions } = useContext(SettingsContext)

  const handleEditMonthlyTransaction = (id: number) => {
    const foundTransaction = monthlyTransactions.find(transaction => transaction.id === id)
    if (foundTransaction) {
      setMonthlyTransaction(foundTransaction)
      setEditTransactionModal(true)
    }
  }

  const titleStyle = { margin: '10px 0' }
  const cardStyle = { width: '100%' }
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
  const transactionTitle = transactionType === 'expense' ? 'Gastos fijos' : 'Ingresos fijos'

  return (
    <BasicCard style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{transactionTitle}</h3>
        <Button variant="contained" color="primary" endIcon={<Add />} onClick={() => setOpenTransactionModal(true)}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <FixedTransactionsTable
          handleDeleteMonthlyTransaction={handleDeleteMonthlyTransaction}
          handleEditMonthlyTransaction={handleEditMonthlyTransaction}
          isIncome={transactionType === 'income'}
        />
      </div>

      <FixedTransactionModal
        open={openTransactionModal}
        handleClose={() => setOpenTransactionModal(false)}
        transactionType={transactionType}
      />

      <FixedTransactionModal
        open={editTransactionModal}
        handleClose={() => setEditTransactionModal(false)}
        transactionType={transactionType}
        monthlyTransaction={monthlyTransaction}
      />
    </BasicCard>
  )
}

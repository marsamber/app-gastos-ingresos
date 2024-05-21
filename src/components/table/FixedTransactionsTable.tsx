/* eslint-disable no-unused-vars */
import { Delete, Edit } from '@mui/icons-material'
import { CircularProgress, IconButton, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import OneFixedTransactionCard from '../card/OneFixedTransactionCard'
import BasicTable from './BasicTable'
import { SettingsContext } from '@/contexts/SettingsContext'

interface FixedTransactionsTableProps {
  handleDeleteMonthlyTransaction: (id: number) => void
  handleEditMonthlyTransaction: (id: number) => void
  isIncome?: boolean
}

export default function FixedTransactionsTable({
  handleDeleteMonthlyTransaction,
  handleEditMonthlyTransaction,
  isIncome = false
}: FixedTransactionsTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [rows, setRows] = useState<any[]>([])
  const { loadingMonthlyTransactions, monthlyTransactions } = useContext(SettingsContext)

  const headCells = [
    { id: 'title', label: 'Título' },
    { id: 'category', label: 'Categoría' },
    { id: 'amount', label: 'Cantidad' },
    { id: 'actions', label: 'Acciones' }
  ]

  useEffect(() => {
    if (!monthlyTransactions) return
    const filteredTransactions = monthlyTransactions.filter(transaction =>
      isIncome ? transaction.amount > 0 : transaction.amount < 0
    )
    const mappedRows = filteredTransactions.map(transaction => ({
      id: transaction.id,
      title: transaction.title,
      category: transaction.category,
      amount: transaction.amount,
      actions: (
        <div key={transaction.id}>
          <IconButton onClick={() => handleEditMonthlyTransaction(transaction.id)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDeleteMonthlyTransaction(transaction.id)}>
            <Delete color="primary" />
          </IconButton>
        </div>
      )
    }))

    mappedRows.sort((a, b) => b.title.localeCompare(a.title))

    setRows(mappedRows)
  }, [monthlyTransactions, isIncome])

  // STYLES
  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  }

  return (
    <>
      {loadingMonthlyTransactions ? (
        <div style={circularProgressStyle}>
          <CircularProgress />
        </div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(row => (
            <OneFixedTransactionCard key={row.id} data={row} />
          ))}
        </div>
      ) : (
        // <BasicTable headCells={headCells} rows={rows} keyOrder="title" numRowsPerPage={10} />
        <BasicTable headCells={headCells} rows={rows} />
      )}
    </>
  )
}

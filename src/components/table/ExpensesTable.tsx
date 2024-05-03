/* eslint-disable no-unused-vars */
import { CircularProgress, IconButton, useMediaQuery } from '@mui/material'
import BasicTable from './BasicTable'
import OneTransactionCard from '../card/OneTransactionCard'
import { TransactionsContext } from '@/contexts/TransactionsContext'
import { useContext, useEffect, CSSProperties, useState, ReactNode } from 'react'
import { Edit, Delete } from '@mui/icons-material'

interface ITransactionTable {
  id: number
  title: string
  category: string
  date: Date
  amount: number
  actions: ReactNode
}

interface ExpensesTableProps {
  handleEditTransaction: (id: number) => void
  handleDeleteTransaction: (id: number) => void
}

export default function ExpensesTable({ handleEditTransaction, handleDeleteTransaction }: ExpensesTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { transactions, loadingTransactions } = useContext(TransactionsContext)
  const [rows, setRows] = useState<ITransactionTable[]>([])

  const headCells = [
    { id: 'title', label: 'Título' },
    { id: 'category', label: 'Categoría' },
    { id: 'date', label: 'Fecha' },
    { id: 'amount', label: 'Cantidad' },
    { id: 'actions', label: 'Acciones' }
  ]

  // DATA
  useEffect(() => {
    if (transactions) {
      let data = transactions
        .filter(transaction => transaction.amount < 0)
        .map(transaction => {
          return {
            id: transaction.id,
            title: transaction.title,
            category: transaction.category,
            date: new Date(transaction.date),
            amount: transaction.amount,
            actions: (
              <div key={transaction.id}>
                <IconButton onClick={() => handleEditTransaction(transaction.id)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDeleteTransaction(transaction.id)}>
                  <Delete color="primary" />
                </IconButton>
              </div>
            )
          }
        })

      setRows(data)
    }
  }, [transactions])

  // STYLES
  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <>
      {loadingTransactions && <CircularProgress style={circularProgressStyle} />}
      {!isMobile && !loadingTransactions && transactions && (
        <BasicTable headCells={headCells} rows={rows} keyOrder="date" orderDirection="desc" numRowsPerPage={10} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          !loadingTransactions &&
          transactions &&
          rows.sort((a, b) => a.date.getDate() - b.date.getDate()).map(row => <OneTransactionCard key={row.id} data={row} />)}
      </div>
    </>
  )
}

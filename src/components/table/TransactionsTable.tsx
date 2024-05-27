/* eslint-disable no-unused-vars */
import { TransactionsContext } from '@/contexts/TransactionsContext'
import { ITransaction } from '@/types/index'
import { Delete, Edit } from '@mui/icons-material'
import { IconButton, useMediaQuery } from '@mui/material'
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import OneTransactionCard from '../card/OneTransactionCard'
import BasicTable from './BasicTable'
import { TablePagination } from './TablePagination'

interface ITransactionTable {
  id: number
  title: string
  category: string
  date: Date
  amount: number
  actions: ReactNode
}

interface TransactionsTableProps {
  handleEditTransaction: (id: number) => void
  handleDeleteTransaction: (id: number) => void
  filterFunction: (transaction: ITransactionTable) => boolean
}

export default function TransactionsTable({
  handleEditTransaction,
  handleDeleteTransaction,
  filterFunction
}: TransactionsTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const containerRef = useRef<HTMLDivElement>(null)
  const { transactions, totalItems, page, limit, handleChangeLimit, handleChangePage } = useContext(TransactionsContext)
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
      const data = transactions
        .filter((transaction: ITransaction) =>
          filterFunction({
            id: transaction.id,
            title: transaction.title,
            category: transaction.category,
            date: new Date(transaction.date),
            amount: transaction.amount,
            actions: <></>
          })
        )
        .map(transaction => ({
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
        }))

      setRows(data)
    }
  }, [transactions])

  return (
    <>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(row => (
            <OneTransactionCard key={row.id} data={row} />
          ))}
          <TablePagination
            totalItems={totalItems}
            page={page}
            limit={limit}
            handleChangePage={handleChangePage}
            handleChangeLimit={handleChangeLimit}
            containerRef={containerRef}
          />
        </div>
      ) : (
        <BasicTable headCells={headCells} rows={rows} type="transactions" />
      )}
    </>
  )
}

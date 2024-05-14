'use client'
import TransactionModal from '@/components/modal/TransactionModal'
import TransactionsTable from '@/components/table/TransactionsTable'
import { TransactionsContext } from '@/contexts/TransactionsContext'
import useFetch from '@/hooks/useFetch'
import { ITransaction } from '@/types/index'
import { Add } from '@mui/icons-material'
import { Autocomplete, Button, Tab, Tabs, TextField, useMediaQuery } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import '../../styles.css'
import customFetch from '@/utils/fetchWrapper'

export default function Transactions() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('this_month')
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  ])
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [addTransactionTable, setAddTransactionTable] = useState(false)
  const [transactions, setTransactions] = useState<ITransaction[] | null>([])
  const [openEditTransaction, setOpenEditTransaction] = useState(false)
  const [transaction, setTransaction] = useState<ITransaction | null>(null)

  const filterOptions = [
    { label: 'Este mes', value: 'this_month' },
    { label: 'Mes pasado', value: 'last_month' },
    { label: 'Este año', value: 'this_year' },
    { label: 'Año pasado', value: 'last_year' },
    { label: 'Todo', value: 'all' }
  ]

  const { data, loading: loadingTransactions } = useFetch<ITransaction[]>(
    `/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
  )

  useEffect(() => {
    setTransactions(data)
  }, [data])

  const addTransaction = (newTransaction: ITransaction) => {
    console.log(newTransaction)
    setTransactions(prev => {
      const updatedTransactions = [...prev!, newTransaction]
      updatedTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      return updatedTransactions
    })
  }

  const editTransaction = (updatedTransaction: ITransaction) => {
    setTransactions(prev => {
      const updatedTransactions = prev!.map(transaction =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
      updatedTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      return updatedTransactions
    })
  }

  const deleteTransaction = (transactionId: number) => {
    setTransactions(prev => prev!.filter(transaction => transaction.id !== transactionId))
  }

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeFilter = (newValue: { label: string; value: string }) => {
    setFilter(newValue.value)
    switch (newValue.value) {
      case 'this_month':
        setMonthsSelected([
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
        ])
        break
      case 'last_month':
        setMonthsSelected([
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
          new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0]
        ])
        break
      case 'this_year':
        setMonthsSelected([
          new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
          new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
        ])
        break
      case 'last_year':
        setMonthsSelected([
          new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0],
          new Date(new Date().getFullYear() - 1, 11, 31).toISOString().split('T')[0]
        ])
        break
      case 'all':
        setMonthsSelected(['', ''])
        break
    }
  }

  const handleEditTransaction = (id: number) => {
    const transaction = transactions?.find(transaction => transaction.id === id)
    if (transaction) {
      setTransaction(transaction)
      setOpenEditTransaction(true)
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    const response = await customFetch(`/api/transactions/${id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      deleteTransaction(id)
    }
  }

  useEffect(() => {
    document.title = `Transacciones`
  }, [])

  // STYLES
  const titleStyle = {
    margin: '10px 0',
    color: 'black'
  }

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px'
  }

  const buttonsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px'
  }

  return (
    <main className="main">
      <TransactionsContext.Provider value={{ transactions, loadingTransactions, addTransaction, editTransaction }}>
        {!isMobile && <h2 style={titleStyle}>Transacciones</h2>}
        <div>
          {isMobile && (
            <div style={buttonsStyle}>
              <Autocomplete
                sx={{ m: 1, width: 150 }}
                size="small"
                options={filterOptions}
                value={filterOptions.find(option => option.value === filter)}
                onChange={(event, newValue) => handleChangeFilter(newValue as { label: string; value: string })}
                getOptionLabel={option => option.label}
                renderInput={params => <TextField {...params} label="Filtro" color="primary" />}
                disableClearable
              />
            </div>
          )}
          <div style={tabsStyle}>
            <Tabs
              classes={{
                indicator: 'indicator'
              }}
              textColor="secondary"
              indicatorColor="secondary"
              value={value}
              onChange={handleChangeTab}
              variant={isMobile ? 'fullWidth' : 'standard'}
            >
              <Tab
                classes={{
                  selected: 'tabSelected'
                }}
                label="Todo"
                value={0}
              />
              <Tab
                classes={{
                  selected: 'tabSelected'
                }}
                label="Gastos"
                value={1}
              />
              <Tab
                classes={{
                  selected: 'tabSelected'
                }}
                label="Ingresos"
                value={2}
              />
            </Tabs>
            {!isMobile && (
              <div style={buttonsStyle}>
                <Autocomplete
                  sx={{ m: 1, width: 150 }}
                  size="small"
                  options={filterOptions}
                  value={filterOptions.find(option => option.value === filter)}
                  onChange={(event, newValue) => handleChangeFilter(newValue as { label: string; value: string })}
                  getOptionLabel={option => option.label}
                  renderInput={params => <TextField {...params} label="Filtro" color="primary" />}
                  disableClearable
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<Add />}
                  onClick={() => setAddTransactionTable(true)}
                >
                  Añadir
                </Button>
              </div>
            )}
          </div>
          <div>
            {value === 0 && (
              <TransactionsTable
                key={0}
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
                filterFunction={() => true}
              />
            )}
            {value === 1 && (
              <TransactionsTable
                key={1}
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
                filterFunction={transaction => transaction.amount < 0}
              />
            )}
            {value === 2 && (
              <TransactionsTable
                key={2}
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
                filterFunction={transaction => transaction.amount > 0}
              />
            )}
          </div>
        </div>
        <TransactionModal open={addTransactionTable} handleClose={() => setAddTransactionTable(false)} />
        <TransactionModal
          open={openEditTransaction}
          handleClose={() => setOpenEditTransaction(false)}
          transaction={transaction}
        />
      </TransactionsContext.Provider>
    </main>
  )
}

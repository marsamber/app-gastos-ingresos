'use client'
import AddTransactionModal from '@/components/modal/AddTransactionModal'
import AllTransactionsTable from '@/components/table/AllTransactionsTable'
import ExpensesTable from '@/components/table/ExpensesTable'
import IncomesTable from '@/components/table/IncomesTable'
import { TransactionsContext } from '@/contexts/TransactionsContext'
import useFetch from '@/hooks/useFetch'
import { ITransaction } from '@/types/index'
import { Add, Edit } from '@mui/icons-material'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  useMediaQuery
} from '@mui/material'
import { SyntheticEvent, use, useContext, useEffect, useState } from 'react'
import '../../styles.css'
import { TransactionContext } from '@/contexts/TransactionContext'
import EditTransactionModal from '@/components/modal/EditTransactionModal'

export default function Transactions() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('this_month')
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  ])
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [addTransactionTable, setAddTransactionTable] = useState(false)
  const { refreshKey, refreshTransactions } = useContext(TransactionContext)
  const [transactions, setTransactions] = useState<ITransaction[] | null>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [editTransaction, setEditTransaction] = useState(false)
  const [transaction, setTransaction] = useState<ITransaction | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true)
      const transactions = await fetch(
        `/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
      ).then(res => res.json())
      setTransactions(transactions)
      setLoadingTransactions(false)
    }

    fetchTransactions()
  }, [monthsSelected, refreshKey])

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeFilter = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value as string)
    switch (event.target.value) {
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
      setEditTransaction(true)
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      refreshTransactions()
    }
  }

  // const {data: transactions, loading: loadingTransactions} = useFetch<ITransaction[]>(`/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`)

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
      <TransactionsContext.Provider value={{ transactions, loadingTransactions }}>
        <h2 style={titleStyle}>Transacciones</h2>
        <div>
          {isMobile && (
            <div style={buttonsStyle}>
              <FormControl sx={{ m: 1, minWidth: 135 }} size="small">
                <InputLabel id="filter-label" color="error">
                  Filtro
                </InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  label="Filtro"
                  onChange={handleChangeFilter}
                  color="error"
                >
                  <MenuItem value="this_month">Este mes</MenuItem>
                  <MenuItem value="last_month">Mes pasado</MenuItem>
                  <MenuItem value="this_year">Este año</MenuItem>
                  <MenuItem value="last_year">Año pasado</MenuItem>
                  <MenuItem value="all">Todo</MenuItem>
                </Select>
              </FormControl>
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
                <FormControl sx={{ m: 1, minWidth: 135 }} size="small">
                  <InputLabel id="filter-label" color="error">
                    Filtro
                  </InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filter}
                    label="Filtro"
                    onChange={handleChangeFilter}
                    color="error"
                  >
                    <MenuItem value="this_month">Este mes</MenuItem>
                    <MenuItem value="last_month">Mes pasado</MenuItem>
                    <MenuItem value="this_year">Este año</MenuItem>
                    <MenuItem value="last_year">Año pasado</MenuItem>
                    <MenuItem value="all">Todo</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="error"
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
              <AllTransactionsTable
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            )}
            {value === 1 && (
              <ExpensesTable
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            )}
            {value === 2 && (
              <IncomesTable
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            )}
          </div>
        </div>
        <AddTransactionModal open={addTransactionTable} handleClose={() => setAddTransactionTable(false)} />
        <EditTransactionModal open={editTransaction} handleClose={() => setEditTransaction(false)} transaction={transaction} />
      </TransactionsContext.Provider>
    </main>
  )
}

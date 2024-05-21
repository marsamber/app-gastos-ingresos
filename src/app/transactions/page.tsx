'use client'
import TransactionModal from '@/components/modal/TransactionModal'
import TransactionsTable from '@/components/table/TransactionsTable'
import { TransactionsContext } from '@/contexts/TransactionsContext'
import { ITransaction } from '@/types/index'
import customFetch from '@/utils/fetchWrapper'
import { handleDateFilterChange } from '@/utils/utils'
import { Add } from '@mui/icons-material'
import { Autocomplete, Button, Tab, Tabs, TextField, useMediaQuery } from '@mui/material'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import '../../styles.css'

export default function Transactions() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('this_month')
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>(
    handleDateFilterChange('this_month') as [string, string]
  )
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [addTransactionTable, setAddTransactionTable] = useState(false)
  const [openEditTransaction, setOpenEditTransaction] = useState(false)
  const [transaction, setTransaction] = useState<ITransaction | null>(null)

  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [type, setType] = useState<'income' | 'expense' | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [transactions, setTransactions] = useState<ITransaction[] | null>([])
  const [totalItems, setTotalItems] = useState(0)

  const refreshTransactions = useCallback(
    (
      newPage: number,
      newLimit: number,
      newSortBy: string,
      newSortOrder: 'asc' | 'desc',
      type: 'income' | 'expense' | null
    ) => {
      setPage(newPage)
      setLimit(newLimit)
      setSortBy(newSortBy)
      setSortOrder(newSortOrder)
      setType(type)
      setRefreshKey(prev => prev + 1)
    },
    []
  )

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await customFetch(
        `/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}&page=${page + 1}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&type=${type}`
      )
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setTotalItems(data.totalItems)
      }
    }
    fetchTransactions()
  }, [refreshKey, monthsSelected, page, limit, sortBy, sortOrder, type])

  const filterOptions = [
    { label: 'Este mes', value: 'this_month' },
    { label: 'Mes pasado', value: 'last_month' },
    { label: 'Este año', value: 'this_year' },
    { label: 'Año pasado', value: 'last_year' },
    { label: 'Todo', value: 'all' }
  ]

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (newValue === 1) {
      setType('expense')
    } else if (newValue === 2) {
      setType('income')
    }
  }

  const handleChangeFilter = (newValue: { label: string; value: string }) => {
    setFilter(newValue.value)

    setMonthsSelected(handleDateFilterChange(newValue.value) as [string, string])
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
      refreshTransactions(page, limit, sortBy, sortOrder, type)
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
      <TransactionsContext.Provider
        value={{
          transactions,
          totalItems,
          refreshTransactions,
          refreshKey,
          page,
          limit,
          sortBy,
          sortOrder,
          type,
          handleChangePage: (newPage: number) => setPage(newPage),
          handleChangeLimit: (newLimit: number) => setLimit(newLimit),
          handleChangeSort: (newSortBy: string) => setSortBy(newSortBy),
          handleChangeOrder: (newOrder: 'asc' | 'desc') => setSortOrder(newOrder)
        }}
      >
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

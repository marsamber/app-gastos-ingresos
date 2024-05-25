'use client'
import BudgetTable from '@/components/table/BudgetTable'
import { BudgetsContext } from '@/contexts/BudgetsContext'
import { RefreshContext } from '@/contexts/RefreshContext'
import { IBudget, IBudgetHistoric } from '@/types/index'
import customFetch from '@/utils/fetchWrapper'
import { handleDateFilterChange } from '@/utils/utils'
import { Autocomplete, Tab, Tabs, TextField, useMediaQuery } from '@mui/material'
import { SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react'
import '../../styles.css'

export default function Budget() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('')
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>(
    handleDateFilterChange('this_month') as [string, string]
  )
  const [present, setPresent] = useState(true)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [transactions, setTransactions] = useState([])
  const { refreshKeyTransactions } = useContext(RefreshContext)

  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('category')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [refreshKeyBudgets, setRefreshKeyBudgets] = useState(0)
  const [budgets, setBudgets] = useState<IBudget[] | IBudgetHistoric[] | null>([])
  const [totalItems, setTotalItems] = useState(0)

  const refreshBudgets = useCallback(
    (newPage: number, newLimit: number, newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setPage(newPage)
      setLimit(newLimit)
      setSortBy(newSortBy)
      setSortOrder(newSortOrder)
      setRefreshKeyBudgets(prev => prev + 1)
    },
    []
  )

  useEffect(() => {
    const fetchBudgets = async () => {
      const url = present
        ? `/api/budgets?page=${page + 1}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&excludeCategory=Ingresos fijos`
        : `/api/budget_historics?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}&page=${page + 1}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&excludeCategory=Ingresos fijos`
      const response = await customFetch(url)
      if (response.ok) {
        const data = await response.json()
        setBudgets(data.budgets)
        setTotalItems(data.totalItems)
      }
    }

    fetchBudgets()
  }, [refreshKeyBudgets, page, limit, sortBy, sortOrder])

  const filterOptions = [
    { label: 'Mes pasado', value: 'last_month' },
    { label: 'Este año', value: 'this_year' },
    { label: 'Año pasado', value: 'last_year' },
    { label: 'Todo', value: 'all' }
  ]

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (newValue === 1) {
      setFilter('all')
      setMonthsSelected(['', ''])
    } else {
      setMonthsSelected(handleDateFilterChange('this_month') as [string, string])
    }
  }

  const handleChangeFilter = (newValue: { label: string; value: string }) => {
    setFilter(newValue.value)
    setMonthsSelected(handleDateFilterChange(newValue.value) as [string, string])
  }

  useEffect(() => {
    document.title = `Presupuesto`
  }, [])

  // DATA
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await customFetch(
        `/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
      )

      const { transactions } = await response.json()
      setTransactions(transactions)
    }

    fetchTransactions()
  }, [monthsSelected, refreshKeyTransactions])

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]
    if (new Date(monthsSelected[1]) >= new Date(currentDate) || monthsSelected[1] === '') {
      setPresent(true)
    } else {
      setPresent(false)
    }
  }, [monthsSelected])

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
    marginBottom: '10px',
    height: '56px'
  }

  const buttonsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px'
  }

  return (
    <main className="main">
      <BudgetsContext.Provider
        value={{
          transactions,
          budgets: budgets,
          totalItems,
          refreshBudgets,
          refreshKey: refreshKeyBudgets,
          page,
          limit,
          sortBy,
          sortOrder,
          handleChangePage: (newPage: number) => setPage(newPage),
          handleChangeLimit: (newLimit: number) => setLimit(newLimit),
          handleChangeSort: (newSortBy: string) => setSortBy(newSortBy),
          handleChangeOrder: (newOrder: 'asc' | 'desc') => setSortOrder(newOrder)
        }}
      >
        {!isMobile && <h2 style={titleStyle}>Presupuesto</h2>}
        <div>
          {isMobile && value === 1 && (
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
              value={value}
              onChange={handleChangeTab}
              variant={isMobile ? 'fullWidth' : 'standard'}
            >
              <Tab
                classes={{
                  selected: 'tabSelected'
                }}
                label="Este mes"
                value={0}
              />
              <Tab
                classes={{
                  selected: 'tabSelected'
                }}
                label="Historial"
                value={1}
              />
            </Tabs>
            {!isMobile && value === 1 && (
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
          </div>
          <div>
            {value === 0 && <BudgetTable includeHistorics={!present} />}
            {value === 1 && <BudgetTable includeHistorics />}
          </div>
        </div>
      </BudgetsContext.Provider>
    </main>
  )
}

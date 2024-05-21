'use client'
import BudgetTable from '@/components/table/BudgetTable'
import { HomeContext } from '@/contexts/HomeContext'
import { RefreshContext } from '@/contexts/RefreshContext'
import useFetch from '@/hooks/useFetch'
import { IBudgetHistorics, IBudgets } from '@/types/index'
import customFetch from '@/utils/fetchWrapper'
import { Autocomplete, Tab, Tabs, TextField, useMediaQuery } from '@mui/material'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import '../../styles.css'
import { handleDateFilterChange } from '@/utils/utils'

export default function Budget() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('')
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>(
    handleDateFilterChange('this_month') as [string, string]
  )
  const [present, setPresent] = useState(true)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [transactions, setTransactions] = useState([])
  const { refreshKeyTransactions } = useContext(RefreshContext)

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
      setLoadingTransactions(true)
      const response = await customFetch(
        `/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
      )

      const { transactions } = await response.json()
      setTransactions(transactions)
      setLoadingTransactions(false)
    }

    fetchTransactions()
  }, [monthsSelected, refreshKeyTransactions])

  const { data: budgetsData, loading: loadingBudgets } = useFetch<IBudgets>('/api/budgets')
  const { data: budgetHistoricsData, loading: loadingBudgetHistorics } = useFetch<IBudgetHistorics>(
    `/api/budget_historics?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
  )

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
      <HomeContext.Provider
        value={{
          monthsSelected,
          transactions,
          loadingTransactions,
          budgets: present ? (budgetsData ? budgetsData.budgets : []) : [],
          loadingBudgets,
          budgetHistorics: budgetHistoricsData ? budgetHistoricsData.budgetHistorics : [],
          loadingBudgetHistorics
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
            {value === 0 && <BudgetTable includeHistorics={false} />}
            {value === 1 && <BudgetTable includeHistorics />}
          </div>
        </div>
      </HomeContext.Provider>
    </main>
  )
}

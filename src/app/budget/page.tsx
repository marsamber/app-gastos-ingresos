'use client'
import HistoricBudgetTable from '@/components/table/HistoricBudgetTable'
import MonthBudgetTable from '@/components/table/MonthBudgetTable'
import { HomeContext } from '@/contexts/HomeContext'
import { RefreshTransactionsContext } from '@/contexts/RefreshTransactionsContext'
import useFetch from '@/hooks/useFetch'
import { IBudget, IBudgetHistoric } from '@/types/index'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs, useMediaQuery } from '@mui/material'
import { SyntheticEvent, use, useContext, useEffect, useState } from 'react'
import '../../styles.css'

export default function Budget() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('')
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  ])
  const [present, setPresent] = useState(true)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [transactions, setTransactions] = useState([])
  const { refreshKey } = useContext(RefreshTransactionsContext)

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (newValue === 1) {
      setFilter('all')
      setMonthsSelected(['', ''])
    } else {
      setMonthsSelected([
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
      ])
    }
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

  useEffect(() => {
    document.title = `Presupuesto`
  }, [])

  // DATA
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

  const { data: budgets, loading: loadingBudgets } = useFetch<IBudget[]>('/api/budgets')
  const { data: budgetHistorics, loading: loadingBudgetHistorics } = useFetch<IBudgetHistoric[]>(
    `/api/budget_historics?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
  )

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]
    if (new Date(monthsSelected[1]) >= new Date(currentDate)) {
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
          transactions,
          loadingTransactions,
          budgets: present ? budgets : [],
          loadingBudgets,
          budgetHistorics,
          loadingBudgetHistorics
        }}
      >
        <h2 style={titleStyle}>Presupuesto</h2>
        <div>
          {isMobile && value === 1 && (
            <div style={buttonsStyle}>
              <FormControl sx={{ m: 1, minWidth: 135 }} size="small">
                <InputLabel id="filter-label" color="primary">
                  Filtro
                </InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  label="Filtro"
                  onChange={handleChangeFilter}
                  color="primary"
                >
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
              // textColor="secondary"
              // indicatorColor="primary"
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
                <FormControl sx={{ m: 1, minWidth: 135 }} size="small">
                  <InputLabel id="filter-label" color="primary">
                    Filtro
                  </InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filter}
                    label="Filtro"
                    onChange={handleChangeFilter}
                    color="primary"
                  >
                    <MenuItem value="last_month">Mes pasado</MenuItem>
                    <MenuItem value="this_year">Este año</MenuItem>
                    <MenuItem value="last_year">Año pasado</MenuItem>
                    <MenuItem value="all">Todo</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
          <div>
            {value === 0 && <MonthBudgetTable />}
            {value === 1 && <HistoricBudgetTable />}
          </div>
        </div>
      </HomeContext.Provider>
    </main>
  )
}

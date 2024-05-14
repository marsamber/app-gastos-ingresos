'use client'
import MonthRangePicker from '@/components/MonthRangePicker'
import BudgetCard from '@/components/card/BudgetCard'
import HistoricDashboardCard from '@/components/card/HistoricDashboardCard'
import MonthDashboardCard from '@/components/card/MonthDashboardCard'
import StatisticsCard from '@/components/card/StatisticsCard'
import TransactionsCard from '@/components/card/TransactionsCard'
import { HomeContext } from '@/contexts/HomeContext'
import { RefreshContext } from '@/contexts/RefreshContext'
import useFetch from '@/hooks/useFetch'
import theme from '@/theme'
import { IBudget, IBudgetHistoric, ITransaction } from '@/types/index'
import { Info } from '@mui/icons-material'
import { Tooltip, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import '../styles.css'

export default function Home() {
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>([
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().endOf('month').format('YYYY-MM-DD')
  ])
  const [budget, setBudget] = useState<number>(0)
  const [present, setPresent] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<ITransaction[] | null>([])
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true)

  const isMobile = useMediaQuery('(max-width: 600px)')

  useEffect(() => {
    document.title = `Dashboard`
  }, [])

  // DATA
  const { refreshKeyTransactions, apiKey } = useContext(RefreshContext)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true)
      const response = await fetch(`/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`, {
        headers: {
          'x-api-key': apiKey || ''
        }
      })
      if (response.status === 401) {
        localStorage.removeItem('apiKey')
        return
      }
      const transactions = await response.json()
      setTransactions(transactions)
      setLoadingTransactions(false)
    }

    fetchTransactions()
  }, [monthsSelected, refreshKeyTransactions])

  const { data: budgets, loading: loadingBudgets } = useFetch<IBudget[]>('/api/budgets', {
    headers: {
      'x-api-key': apiKey || ''
    }
  })
  const { data: budgetHistorics, loading: loadingBudgetHistorics } = useFetch<IBudgetHistoric[]>(
    `/api/budget_historics?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`,
    {
      headers: {
        'x-api-key': apiKey || ''
      }
    }
  )

  useEffect(() => {
    if (budgets && transactions && budgetHistorics) {
      let totalBudget = 0
      const totalHistorics = budgetHistorics
        .filter(budgetHistoric => budgetHistoric.category !== 'Ingresos fijos') // We don't want to take into account the fixed incomes
        .reduce((acc, historic) => acc + historic.amount, 0)
      const totalSpent = transactions
        .filter(transaction => transaction.category !== 'Ingresos fijos')
        .reduce((acc, transaction) => acc + transaction.amount, 0)

      const currentDate = new Date().toISOString().split('T')[0]
      // If the second month is greater than the current date, we will take into account the budgets
      if (new Date(monthsSelected[1]) >= new Date(currentDate)) {
        totalBudget = budgets
          .filter(budget => budget.category !== 'Ingresos fijos')
          .reduce((acc, budget) => acc + budget.amount, 0)
      }

      setBudget(totalBudget + totalHistorics + totalSpent)
    }
  }, [budgets, transactions, budgetHistorics])

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]
    if (new Date(monthsSelected[1]) >= new Date(currentDate)) {
      setPresent(true)
    } else {
      setPresent(false)
    }
  }, [monthsSelected])

  useEffect(() => {
    if (transactions) {
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }, [transactions])

  // STYLES
  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: isMobile ? 'unset' : 'space-between',
    flexDirection: isMobile ? 'column-reverse' : 'row',
    alignItems: 'center',
    width: '100%'
  }

  const titleStyle: CSSProperties = {
    margin: '10px 0',
    color: 'black'
  }

  const budgetStyle: CSSProperties = {
    margin: '10px 0',
    color: theme.palette.primary.main,
    textAlign: 'right',
    display: 'flex',
    alignItems: isMobile ? 'center' : 'flex-start',
    gap: '5px'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '10px'
  }

  const rowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '10px',
    width: '100%'
  }

  return (
    <main className="main">
      <HomeContext.Provider
        value={{
          monthsSelected,
          setMonthsSelected,
          budget,
          setBudget,
          transactions,
          budgets: present ? budgets : [],
          budgetHistorics,
          loadingTransactions,
          loadingBudgets,
          loadingBudgetHistorics
        }}
      >
        <div style={headerStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'unset' : 'center',
              gap: isMobile ? 0 : '10px'
            }}
          >
            {!isMobile && <h2 style={titleStyle}>Dashboard</h2>}
            <MonthRangePicker setMonthsSelected={monthsSelected => setMonthsSelected(monthsSelected)} />
          </div>
          {isMobile ? (
            <h4 style={budgetStyle}>
              Presupuesto restante: {budget} €
              <Tooltip title="Presupuesto restante: Calculado a partir de los presupuestos asignados a las categorías y los gastos registrados. No incluye los ingresos fijos.">
                <Info />
              </Tooltip>
            </h4>
          ) : (
            <h3 style={budgetStyle}>
              Presupuesto restante: {budget} €
              <Tooltip title="Presupuesto restante: Calculado a partir de los presupuestos asignados a las categorías y los gastos registrados. No incluye los ingresos fijos.">
                <Info />
              </Tooltip>
            </h3>
          )}
        </div>
        <div style={containerStyle}>
          <BudgetCard />
          <div style={rowStyle}>
            <TransactionsCard />
            <MonthDashboardCard />
            <StatisticsCard />
          </div>
          <HistoricDashboardCard />
        </div>
      </HomeContext.Provider>
    </main>
  )
}

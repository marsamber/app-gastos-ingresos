'use client'
import MonthRangePicker from '@/components/MonthRangePicker'
import BudgetCard from '@/components/card/BudgetCard'
import HistoricDashboardCard from '@/components/card/HistoricDashboardCard'
import MonthDashboardCard from '@/components/card/MonthDashboardCard'
import StatisticsCard from '@/components/card/StatisticsCard'
import TransactionsCard from '@/components/card/TransactionsCard'
import DownloadReportButton from '@/components/reports/DownloadReportButton'
import { HomeContext } from '@/contexts/HomeContext'
import { RefreshContext } from '@/contexts/RefreshContext'
import useFetch from '@/hooks/useFetch'
import theme from '@/theme'
import { IBudgetHistorics, IBudgets, IMonthlyTransactions, ITransaction } from '@/types/index'
import customFetch from '@/utils/fetchWrapper'
import { formatDate, getTwoFirstDecimals } from '@/utils/utils'
import { Info } from '@mui/icons-material'
import { CircularProgress, Tooltip, useMediaQuery } from '@mui/material'
import { CSSProperties, Suspense, useContext, useEffect, useState } from 'react'
import '../styles.css'

export default function Home() {
  const today = new Date()
  const [monthsSelected, setMonthsSelected] = useState<[string, string]>([
    formatDate(today.getFullYear(), today.getMonth(), 1, 0, 0),
    formatDate(today.getFullYear(), today.getMonth() + 1, 0, 23, 59)
  ])

  const [budget, setBudget] = useState<number>(0)
  const [present, setPresent] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<ITransaction[] | null>([])
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true)

  const isMobile = useMediaQuery('(max-width: 600px)')
  const sideBarCollapsed = useMediaQuery('(max-width: 899px)')

  useEffect(() => {
    document.title = `Dashboard`
  }, [])

  // DATA
  const { refreshKeyTransactions } = useContext(RefreshContext)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true)
      const response = await customFetch(
        `/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}&sortBy=date&sortOrder=desc`
      )

      const { transactions } = await response.json() as { transactions: ITransaction[] }
      setTransactions(transactions)
      setLoadingTransactions(false)
    }

    fetchTransactions().catch(error => console.error('Error fetching transactions:', error))
  }, [monthsSelected, refreshKeyTransactions])

  const { data: budgetsData, loading: loadingBudgets } = useFetch<IBudgets>('/api/budgets')
  const { data: budgetHistoricsData, loading: loadingBudgetHistorics } = useFetch<IBudgetHistorics>(
    `/api/budget_historics?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`
  )
  const { data: monthlyTransactionsData } = useFetch<IMonthlyTransactions>('api/monthly_transactions?type=expense')

  useEffect(() => {
    if (budgetsData && transactions && budgetHistoricsData && monthlyTransactionsData) {
      let totalBudget = 0
      let totalFixedExpenses = 0
      const currentDate = formatDate(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes()
      )
      // If the second month is greater than the current date, we will take into account the budgets
      if (new Date(monthsSelected[1]) >= new Date(currentDate)) {
        totalBudget = budgetsData.budgets
          .filter(budget => budget.category !== 'Ingresos fijos')
          .reduce((acc, budget) => acc + budget.amount, 0)

        totalFixedExpenses = monthlyTransactionsData.monthlyTransactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        )
      }

      const totalHistorics = budgetHistoricsData.budgetHistorics
        .filter(budgetHistoric => budgetHistoric.category !== 'Ingresos fijos') // We don't want to take into account the fixed incomes
        .reduce((acc, historic) => acc + historic.amount, 0)

      const totalSpent = transactions
        .filter(transaction => transaction.category !== 'Ingresos fijos')
        .reduce((acc, transaction) => acc + transaction.amount, 0)

      setBudget(getTwoFirstDecimals(totalBudget + totalHistorics + totalSpent + totalFixedExpenses))
    }
  }, [budgetsData, transactions, budgetHistoricsData])

  useEffect(() => {
    const currentDate = formatDate(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getHours(),
      today.getMinutes()
    )
    const [year, month, day] = monthsSelected[1].split('-').map(date => parseInt(date))
    const endDate = formatDate(year, month - 1, day, 23, 59)
    if (new Date(endDate) >= new Date(currentDate)) {
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
          budgets: present ? (budgetsData ? budgetsData.budgets : []) : null,
          budgetHistorics: budgetHistoricsData ? budgetHistoricsData.budgetHistorics : [],
          loadingTransactions,
          loadingBudgets,
          loadingBudgetHistorics
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <div style={headerStyle}>
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'unset' : 'center',
                gap: isMobile ? 0 : '10px'
              }}
            >
              {!sideBarCollapsed && <h2 style={titleStyle}>Dashboard</h2>}
              <MonthRangePicker
                monthsSelected={monthsSelected}
                setMonthsSelected={setMonthsSelected}
              />
            </div>
            {isMobile ? (
              <h4 style={budgetStyle}>
                Presupuesto restante: {budget} €
                <Tooltip title="Presupuesto restante: Calculado a partir de los presupuestos asignados a las categorías y los gastos registrados. Incluye los gastos fijos del mes presente.">
                  <Info />
                </Tooltip>
              </h4>
            ) : (
              <h3 style={budgetStyle}>
                Presupuesto restante: {budget} €
                <Tooltip title="Presupuesto restante: Calculado a partir de los presupuestos asignados a las categorías y los gastos registrados. Incluye los gastos fijos del mes presente.">
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
          <DownloadReportButton />
        </Suspense>
      </HomeContext.Provider>
    </main>
  )
}

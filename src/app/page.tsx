'use client'
import MonthRangePicker from '@/components/MonthRangePicker'
import BudgetCard from '@/components/card/BudgetCard'
import HistoricDashboardCard from '@/components/card/HistoricDashboardCard'
import MonthDashboardCard from '@/components/card/MonthDashboardCard'
import StatisticsCard from '@/components/card/StatisticsCard'
import TransactionsCard from '@/components/card/TransactionsCard'
import { HomeContext } from '@/contexts/HomeContext'
import useFetch from '@/hooks/useFetch'
import { IBudget, IBudgetHistoric, ITransaction } from '@/types/index'
import { useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import '../styles.css'
import { RefreshTransactionsContext } from '@/contexts/RefreshTransactionsContext'

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
  const {refreshKey} = useContext(RefreshTransactionsContext)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true)
      const transactions = await fetch(`/api/transactions?startDate=${monthsSelected[0]}&endDate=${monthsSelected[1]}`).then(res => res.json())
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
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  }
  const titleStyle = {
    margin: '10px 0',
    color: 'black'
  }

  const budgetStyle: CSSProperties = {
    margin: '10px 0',
    color: '#af1f0e',
    textAlign: 'right'
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
            <h2 style={titleStyle}>Dashboard</h2>
            <MonthRangePicker
              monthsSelected={monthsSelected}
              setMonthsSelected={monthsSelected => setMonthsSelected(monthsSelected)}
            />
          </div>
          {loadingTransactions || loadingBudgets || loadingBudgetHistorics ? (
            <p>Cargando...</p>
          ) : (
            budgets && transactions && budgetHistorics && <h3 style={budgetStyle}>Presupuesto restante: {budget} €</h3>
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

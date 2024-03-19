'use client'
import styles from './page.module.css'
import { useMediaQuery } from '@mui/material'
import { CSSProperties } from 'react'
import TransactionsCard from '@/components/TransactionsCard'
import MonthDashboardCard from '@/components/MonthDashboardCard'
import StatisticsCard from '@/components/StatisticsCard'
import BudgetCard from '@/components/BudgetCard'
import HistoricDashboardCard from '@/components/HistoricDashboardCard'

export default function Home() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const budget = 1000

  const isMobile = useMediaQuery('(max-width: 600px)')

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
    alignItems: 'flex-start',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '10px',
    width: '100%'
  }

  return (
    <main className={styles.main}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Dashboard {currentMonth}</h2>
        <h3 style={budgetStyle}>Presupuesto restante: {budget}€</h3>
      </div>
      <div style={containerStyle}>
        <div style={rowStyle}>
          <BudgetCard />
        </div>
        <div style={rowStyle}>
          <TransactionsCard />
          <MonthDashboardCard />
          <StatisticsCard />
        </div>
        <HistoricDashboardCard />
      </div>
    </main>
  )
}

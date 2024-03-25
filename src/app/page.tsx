'use client'
import { useMediaQuery } from '@mui/material'
import { CSSProperties } from 'react'
import TransactionsCard from '@/components/TransactionsCard'
import MonthDashboardCard from '@/components/MonthDashboardCard'
import StatisticsCard from '@/components/StatisticsCard'
import BudgetCard from '@/components/BudgetCard'
import HistoricDashboardCard from '@/components/HistoricDashboardCard'
import MonthRangePicker from '@/components/MonthRangePicker'
import '../styles.css'

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
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '10px',
    width: '100%'
  }

  return (
    <main className='main'>
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
          <MonthRangePicker />
        </div>
        <h3 style={budgetStyle}>Presupuesto restante: {budget}€</h3>
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
    </main>
  )
}

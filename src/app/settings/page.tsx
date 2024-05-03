'use client'
import CategoriesCard from '@/components/card/CategoriesCard'
import FixedExpensesCard from '@/components/card/FixedExpensesCard'
import FixedIncomesCard from '@/components/card/FixedIncomesCard'
import { useMediaQuery } from '@mui/material'
import { CSSProperties } from 'react'
import '../../styles.css'

export default function Settings() {
  const isTablet = useMediaQuery('(max-width: 1024px)')
  
  // STYLES
  const titleStyle = {
    margin: '10px 0',
    color: 'black'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: isTablet ? 'column' : 'row',
    gap: '10px',
    width: '100%'
  }

  const columnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: isTablet ? '100%' : '50%',
    height: '100%'
  }

  return (
    <main className="main">
      <h2 style={titleStyle}>Configuración</h2>
      <div style={containerStyle}>
        <div style={columnStyle}>
          <FixedIncomesCard />
          <FixedExpensesCard />
        </div>
        <div style={columnStyle}>
          <CategoriesCard />
        </div>
      </div>
    </main>
  )
}

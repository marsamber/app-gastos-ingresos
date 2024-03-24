'use client'
import { SelectChangeEvent, Tab, Tabs, useMediaQuery } from '@mui/material'
import styles from '../page.module.css'
import { useState } from 'react'
import MonthBudgetTable from '@/components/MonthBudgetTable'
import HistoricBudgetTable from '@/components/HistoricBudgetTable'

export default function Settings() {
  const [value, setValue] = useState(0)
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    }

  // STYLES
  const titleStyle = {
    margin: '10px 0',
    color: 'black'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '10px'
  }

  return (
    <main className={styles.main}>
      <h2 style={titleStyle}>Configuración</h2>
      <div style={containerStyle}>
      </div>
    </main>
  )
}

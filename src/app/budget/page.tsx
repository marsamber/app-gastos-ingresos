'use client'
import { SelectChangeEvent, Tab, Tabs, useMediaQuery } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import MonthBudgetTable from '@/components/table/MonthBudgetTable'
import HistoricBudgetTable from '@/components/table/HistoricBudgetTable'
import '../../styles.css'

export default function Budget() {
  const [value, setValue] = useState(0)
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

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

  return (
    <main className="main">
      <h2 style={titleStyle}>Presupuesto</h2>
      <div>
        <div style={tabsStyle}>
          <Tabs
            classes={{
              indicator: 'indicator'
            }}
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChangeTab}
            variant={isMobile ? 'fullWidth' : 'standard'}
          >
            <Tab classes={{
              selected: 'tabSelected'
            }} label="Este mes" value={0} />
            <Tab classes={{
              selected: 'tabSelected'
            }} label="Historial" value={1} />
          </Tabs>
        </div>
        <div>
          {value === 0 && <MonthBudgetTable />}
          {value === 1 && <HistoricBudgetTable />}
        </div>
      </div>
    </main>
  )
}

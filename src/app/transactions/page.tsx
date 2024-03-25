'use client'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  useMediaQuery
} from '@mui/material'
import { useState } from 'react'
import { Add } from '@mui/icons-material'
import AllTransactionsTable from '@/components/AllTransactionsTable'
import OutcomesTable from '@/components/OutcomesTable'
import IncomesTable from '@/components/IncomesTable'
import '../../styles.css'

export default function Transactions() {
  const [value, setValue] = useState(0)
  const [filter, setFilter] = useState('this_month')
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeFilter = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value as string)
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

  const buttonsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px'
  }

  return (
    <main className='main'>
      <h2 style={titleStyle}>Transacciones</h2>
      <div>
        {isMobile && (
          <div style={buttonsStyle}>
            <FormControl sx={{ m: 1, minWidth: 135 }} size="small">
              <InputLabel id="filter-label" color="error">
                Filtro
              </InputLabel>
              <Select labelId="filter-label" value={filter} label="Filtro" onChange={handleChangeFilter} color="error">
                <MenuItem value="this_month">Este mes</MenuItem>
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
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChangeTab}
            variant={isMobile ? 'fullWidth' : 'standard'}
          >
            <Tab label="Todo" value={0} />
            <Tab label="Gastos" value={1} />
            <Tab label="Ingresos" value={2} />
          </Tabs>
          {!isMobile && (
            <div style={buttonsStyle}>
              <FormControl sx={{ m: 1, minWidth: 135 }} size="small">
                <InputLabel id="filter-label" color="error">
                  Filtro
                </InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  label="Filtro"
                  onChange={handleChangeFilter}
                  color="error"
                >
                  <MenuItem value="this_month">Este mes</MenuItem>
                  <MenuItem value="last_month">Mes pasado</MenuItem>
                  <MenuItem value="this_year">Este año</MenuItem>
                  <MenuItem value="last_year">Año pasado</MenuItem>
                  <MenuItem value="all">Todo</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="error" endIcon={<Add />}>
                Añadir
              </Button>
            </div>
          )}
        </div>
        <div>
          {value === 0 && <AllTransactionsTable filter={filter} />}
          {value === 1 && <OutcomesTable filter={filter} />}
          {value === 2 && <IncomesTable filter={filter} />}
        </div>
      </div>
    </main>
  )
}

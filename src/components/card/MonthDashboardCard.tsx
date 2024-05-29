import { HomeContext } from '@/contexts/HomeContext'
import { formatMonthYear, getDateWeekOfMonth, monthNames } from '@/utils/utils'
import { Autocomplete, CircularProgress, TextField, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import BasicCard from './BasicCard'

export interface ISummaryChart {
  name: string
  Gastado: number
}

export default function MonthDashboardCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const [title, setTitle] = useState<string>('Resumen del mes (semanas)')
  const [filter, setFilter] = useState('weekly')
  const { monthsSelected, transactions, loadingTransactions } = useContext(HomeContext)

  const areMonthsSelectedSameMonth =
    monthsSelected[0].split('-')[1] === monthsSelected[1].split('-')[1] &&
    monthsSelected[0].split('-')[0] === monthsSelected[1].split('-')[0]

  const [data, setData] = useState<ISummaryChart[]>([])

  // DATA
  const getWeekData = () => {
    const dataMap = new Map()
    const months: string[] = []
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const month = formatMonthYear(transaction.date.toLocaleString())
        if (!months.includes(month)) {
          months.push(month)
        }
        const week = getDateWeekOfMonth(new Date(transaction.date))
        const key = `${week} (${month})`
        const existingEntry = dataMap.get(key)
        if (existingEntry) {
          existingEntry.Gastado -= transaction.amount
        } else {
          dataMap.set(key, { name: `Sem. ${week} (${month})`, Gastado: -transaction.amount })
        }
      })

    // Ensure all weeks are represented in the data
    for (let i = 1; i <= 5; i++) {
      for (const month of months) {
        const key = `${i} (${month})`
        if (!dataMap.has(key)) {
          dataMap.set(key, { name: `Sem. ${i} (${month})`, Gastado: 0 })
        }
      }
    }

    // key format: 'Sem. 1 (Ene 21)'
    return Array.from(dataMap.values()).sort((a, b) => {
      const aMonth = a.name.split('(')[1].substring(0, a.name.split('(')[1].length - 4)
      const bMonth = b.name.split('(')[1].substring(0, b.name.split('(')[1].length - 4)
      const aYear = a.name.split('(')[1].substring(a.name.split('(')[1].length - 3, a.name.split('(')[1].length - 1)
      const bYear = b.name.split('(')[1].substring(b.name.split('(')[1].length - 3, b.name.split('(')[1].length - 1)

      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear)
      } else if (monthNames.indexOf(aMonth) !== monthNames.indexOf(bMonth)) {
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
      } else {
        const aWeek = parseInt(a.name.split(' ')[1])
        const bWeek = parseInt(b.name.split(' ')[1])
        return aWeek - bWeek
      }
    })
  }

  const getMonthData = () => {
    const dataMap = new Map()
    const [startDate, endDate] = monthsSelected.map(date => new Date(date))
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const key = formatMonthYear(currentDate.toISOString())
      if (!dataMap.has(key)) {
        dataMap.set(key, { name: key, Gastado: 0 })
      }
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const key = formatMonthYear(transaction.date.toLocaleString())
        const existingEntry = dataMap.get(key)
        if (existingEntry) {
          existingEntry.Gastado -= transaction.amount
        }
      })

    // key format: 'Ene 21'
    return Array.from(dataMap.values()).sort((a, b) => {
      const aMonth = a.name.split(' ')[0]
      const bMonth = b.name.split(' ')[0]
      const aYear = a.name.split(' ')[1]
      const bYear = b.name.split(' ')[1]

      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear)
      } else {
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
      }
    })
  }

  const getDayData = () => {
    const dataMap = new Map()
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const date = new Date(transaction.date)
        const dayKey = date.toISOString().split('T')[0] // Formato YYYY-MM-DD
        const dateString = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: '2-digit'
        })
        const existingEntry = dataMap.get(dayKey)
        if (existingEntry) {
          existingEntry.Gastado -= transaction.amount
        } else {
          dataMap.set(dayKey, { name: dateString, Gastado: -transaction.amount })
        }
      })

    // Asegurar que todos los días entre las fechas seleccionadas están representados
    const [startDate, endDate]: Date[] = monthsSelected.map(date => new Date(date))
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayKey = currentDate.toISOString().split('T')[0]
      const dateString = currentDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      if (!dataMap.has(dayKey)) {
        dataMap.set(dayKey, { name: dateString, Gastado: 0 })
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return Array.from(dataMap.values()).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
  }
  useEffect(() => {
    let sortedData: ISummaryChart[] = []
    if (areMonthsSelectedSameMonth) {
      setTitle('Resumen semanal')
      setFilter('weekly')
      sortedData = getWeekData()
    } else {
      setTitle('Resumen mensual')
      setFilter('monthly')
      sortedData = getMonthData()
    }

    setData(sortedData)
  }, [transactions, areMonthsSelectedSameMonth, monthsSelected])

  // FILTER
  const filterOptions = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Diario', value: 'daily' }
  ]

  const handleChangeFilter = (newValue: { label: string; value: string }) => {
    setFilter(newValue.value)
  }

  useEffect(() => {
    if (filter === 'monthly') {
      setTitle('Resumen mensual')
      setData(getMonthData())
    } else if (filter === 'weekly') {
      setTitle('Resumen semanal')
      setData(getWeekData())
    } else {
      setTitle('Resumen diario')
      setData(getDayData())
    }
  }, [filter, transactions])

  // STYLES
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const titleStyle = {
    margin: '10px 0'
  }

  const cardStyle = {
    width: isMobile ? '100%' : '40%',
    height: isTablet ? '500px' : '450px'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    height: isTablet ? '400px' : '350px'
  }

  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const gastado: number = Number(payload.find(entry => entry.name === 'Gastado')?.value) || 0

      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <b>{label}</b>
          <p style={{ color: '#FF6384' }}>{`Gastado: ${gastado} €`}</p>
        </div>
      )
    }
  }

  return (
    <BasicCard style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <Autocomplete
          sx={{ m: 1, width: 130 }}
          size="small"
          options={filterOptions}
          value={filterOptions.find(option => option.value === filter)}
          onChange={(event, newValue) => handleChangeFilter(newValue as { label: string; value: string })}
          getOptionLabel={option => option.label}
          renderInput={params => <TextField {...params} label="Filtro" color="primary" />}
          disableClearable
        />
      </div>
      <div style={containerStyle}>
        {loadingTransactions ? (
          <div style={circularProgressStyle}>
            <CircularProgress />
          </div>
        ) : !data.some(item => item.Gastado !== 0) ? (
          <p>No hay datos para mostrar</p>
        ) : (
          <ResponsiveContainer>
            <LineChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 25,
                bottom: filter !== 'weekly' ? 20 : 40,
                left: 25
              }}
              style={{ fontSize: '14px' }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : -25}
                textAnchor="end"
              />
              <YAxis unit=" €" />
              <Tooltip content={props => <CustomTooltip {...props} />} />
              <Legend verticalAlign="top" height={36} />
              <Line dataKey="Gastado" type="monotone" fill="#FF6384" stroke="#FF6384" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </BasicCard>
  )
}

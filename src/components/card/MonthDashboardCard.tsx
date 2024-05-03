import { HomeContext } from '@/contexts/HomeContext'
import { CircularProgress, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import BasicCard from './BasicCard'
import { getDateWeekOfMonth, getMonthName, monthNames } from '@/utils/utils'

export interface ISummaryChart {
  name: string
  Gastado: number
}

export default function MonthDashboardCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const { monthsSelected, transactions, loadingTransactions } = useContext(HomeContext)

  const areMonthsSelectedSameMonth =
    monthsSelected[0].split('-')[1] === monthsSelected[1].split('-')[1] &&
    monthsSelected[0].split('-')[0] === monthsSelected[1].split('-')[0]

  const [data, setData] = useState<ISummaryChart[]>([])

  // DATA
  const getWeekData = () => {
    const dataMap = new Map()
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const week = getDateWeekOfMonth(new Date(transaction.date))
        const weekKey = week.toString()
        const existingEntry = dataMap.get(weekKey)
        if (existingEntry) {
          existingEntry.Gastado -= transaction.amount
        } else {
          dataMap.set(weekKey, { name: `Sem. ${weekKey}`, Gastado: -transaction.amount })
        }
      })

    // Ensure all weeks are represented in the data
    for (let i = 1; i <= 5; i++) {
      const weekKey = i.toString()
      if (!dataMap.has(weekKey)) {
        dataMap.set(weekKey, { name: `Sem. ${weekKey}`, Gastado: 0 })
      }
    }

    return Array.from(dataMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }

  const getMonthData = () => {
    const dataMap = new Map()
    const [startDate, endDate] = monthsSelected.map(date => new Date(date))
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const month = getMonthName(currentDate)
      if (!dataMap.has(month)) {
        dataMap.set(month, { name: month, Gastado: 0 })
      }
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    transactions?.forEach(transaction => {
      const month = getMonthName(new Date(transaction.date))
      const existingEntry = dataMap.get(month)
      if (existingEntry) {
        existingEntry.Gastado -= transaction.amount
      }
    })

    return Array.from(dataMap.values()).sort((a, b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name))
  }

  useEffect(() => {
    const sortedData: ISummaryChart[] = areMonthsSelectedSameMonth ? getWeekData() : getMonthData()
    setData(sortedData)
  }, [transactions, areMonthsSelectedSameMonth, monthsSelected])

  // STYLES
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
    height: '100%'
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const gastado: number = Number(payload.find(entry => entry.name === 'Gastado')?.value) || 0

      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <b>{`Semana ${label}`}</b>
          <p style={{ color: '#FF6384' }}>{`Gastado: ${gastado} €`}</p>
        </div>
      )
    }
  }

  return (
    <BasicCard style={cardStyle}>
      {areMonthsSelectedSameMonth ? (
        <h3 style={titleStyle}>Resumen del mes (semanas)</h3>
      ) : (
        <h3 style={titleStyle}>Resumen de los meses seleccionados</h3>
      )}
      {loadingTransactions && (
        <div style={circularProgressStyle}>
          <CircularProgress />
        </div>
      )}
      {!loadingTransactions && !data.some(item => item.Gastado !== 0) ? (
        <p>No hay datos para mostrar</p>
      ) : (
        <div style={containerStyle}>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }}
              style={{ fontSize: '14px' }}
            >
              <XAxis dataKey="name" />
              <YAxis unit=" €" />
              <Tooltip content={props => <CustomTooltip {...props} />} />
              <Legend />
              <Bar dataKey="Gastado" barSize={50} fill="#FF6384" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </BasicCard>
  )
}

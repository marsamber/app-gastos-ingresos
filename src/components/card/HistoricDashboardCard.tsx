import { HomeContext } from '@/contexts/HomeContext'
import useFetch from '@/hooks/useFetch'
import { IBudgetHistoric, ITransaction } from '@/types/index'
import { convertDate, formatMonthYear } from '@/utils/utils'
import { CircularProgress, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import BasicCard from './BasicCard'

interface IHistoricChart {
  name: string
  Gastado: number
  Presupuestado: number
}

export default function HistoricDashboardCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [monthsHistoric, setMonthsHistoric] = useState<[string, string]>(['', ''])
  const [data, setData] = useState<IHistoricChart[]>([])

  const { monthsSelected, budgets, loadingBudgets } = useContext(HomeContext)

  useEffect(() => {
    const calculateMonthsHistoric = () => {
      const date = new Date(monthsSelected[1])
      const isLeapYear = date.getFullYear() % 4 === 0
      const daysToSubtract = isLeapYear ? 365 : 364
      date.setDate(date.getDate() - daysToSubtract)
      return date.toISOString().split('T')[0]
    }

    const monthsHistoric = calculateMonthsHistoric()
    setMonthsHistoric([monthsHistoric, monthsSelected[1]!])
  }, [monthsSelected])

  const { data: transactions, loading: loadingTransactions } = useFetch<ITransaction[]>(
    `/api/transactions?startDate=${monthsHistoric[0]}&endDate=${monthsHistoric[1]}`
  )
  const { data: budgetHistorics, loading: loadingBudgetHistorics } = useFetch<IBudgetHistoric[]>(
    `/api/budget_historics?startDate=${monthsHistoric[0]}&endDate=${monthsHistoric[1]}`
  )

  useEffect(() => {
    const dataMap = new Map()

    // Initialize with current month from budgets
    if (budgets) {
      const currentMonthKey = formatMonthYear(monthsSelected[1]!)
      dataMap.set(currentMonthKey, {
        name: currentMonthKey,
        Gastado: 0,
        Presupuestado: budgets
          .filter(budget => budget.category !== 'Ingresos fijos')
          .reduce((acc, budget) => acc + budget.amount, 0)
      })
    }

    // Merge budget historics
    budgetHistorics
      ?.filter(historic => historic.category !== 'Ingresos fijos')
      .forEach(historic => {
        const monthKey = formatMonthYear(historic.date as string)
        const entry = dataMap.get(monthKey) || { name: monthKey, Gastado: 0, Presupuestado: 0 }
        entry.Presupuestado += historic.amount
        dataMap.set(monthKey, entry)
      })

    // Merge transactions
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const monthKey = formatMonthYear(transaction.date as string)
        const entry = dataMap.get(monthKey) || { name: monthKey, Gastado: 0, Presupuestado: 0 }
        entry.Gastado -= transaction.amount
        dataMap.set(monthKey, entry)
      })

    const sortedData = Array.from(dataMap.values()).sort((a, b) => {
      const aDate = convertDate(a.name)
      const bDate = convertDate(b.name)
      return aDate.year !== bDate.year ? aDate.year - bDate.year : aDate.month - bDate.month
    })

    setData(sortedData)
  }, [budgets, transactions, budgetHistorics])

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const cardStyle = {
    width: isMobile ? '100%' : '100%',
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
      const presupuestado: number = Number(payload.find(entry => entry.name === 'Presupuestado')?.value) || 0
      const restante: number = presupuestado - gastado

      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <b>{`${label}`}</b>
          <p style={{ color: '#00C49F' }}>{`Presupuestado: ${presupuestado} €`}</p>
          <p style={{ color: '#FF6384' }}>{`Gastado: ${gastado} €`}</p>
          <p style={{ color: restante <= 0 ? '#FF0042' : 'black' }}>{`Restante: ${restante} €`}</p>
        </div>
      )
    }
  }

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Gastos mensuales</h3>
      <div style={containerStyle}>
        {loadingTransactions || loadingBudgets || loadingBudgetHistorics ? (
          <div style={circularProgressStyle}>
            <CircularProgress />
          </div>
        ) : !data.some(item => item.Gastado !== 0 || item.Presupuestado !== 0)  ? (
          <p>No hay datos para mostrar</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
              style={{ fontSize: '14px' }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" xAxisId={0} />
              <XAxis dataKey="name" xAxisId={1} hide />
              <YAxis unit=" €" />
              <Tooltip content={props => <CustomTooltip {...props} />} />
              <Bar dataKey="Presupuestado" barSize={40} xAxisId={0} fill="#00C49F" />
              <Bar dataKey="Gastado" barSize={40} xAxisId={1} fill="#FF6384">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.Gastado >= entry.Presupuestado ? '#FF0042' : '#FF6384'} />
                ))}
              </Bar>
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </BasicCard>
  )
}

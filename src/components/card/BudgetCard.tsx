import { HomeContext } from '@/contexts/HomeContext'
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

interface IBudgetChart {
  name: string
  Gastado: number
  Presupuestado: number
}

export default function BudgetCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const { transactions, budgets, budgetHistorics, loadingTransactions, loadingBudgets, loadingBudgetHistorics } =
    useContext(HomeContext)
  const [data, setData] = useState<IBudgetChart[]>([])

  // DATA
  const mergeBudgetData = (budgetData: Map<string, IBudgetChart>) => {
    // Safe check and merge both budgets and budget historics if they are not null
    ;[...(budgets ?? []), ...(budgetHistorics ?? [])].forEach(item => {
      if (item.amount > 0) {
        const existingEntry = budgetData.get(item.category)
        if (existingEntry) {
          existingEntry.Presupuestado += item.amount
        } else {
          budgetData.set(item.category, { name: item.category, Gastado: 0, Presupuestado: item.amount })
        }
      }
    })
  }

  const addTransactionData = (budgetData: Map<string, IBudgetChart>) => {
    // Safe check and aggregate transactions if they are not null
    ;(transactions ?? []).forEach(transaction => {
      const category = budgetData.get(transaction.category)
      if (category) {
        category.Gastado -= transaction.amount
      } else {
        // If there's a transaction without a corresponding budget/budget historic, create a new category entry
        budgetData.set(transaction.category, {
          name: transaction.category,
          Gastado: -transaction.amount,
          Presupuestado: 0
        })
      }
    })
  }

  useEffect(() => {
    const budgetData = new Map<string, IBudgetChart>()

    // Assuming budgets, transactions, and budgetHistorics can all potentially be null
    mergeBudgetData(budgetData)
    addTransactionData(budgetData)

    setData(Array.from(budgetData.values())) // Convert map values to array for rendering or further processing
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
    flexDirection: 'column',
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
      <h3 style={titleStyle}>Presupuesto</h3>
      {(loadingTransactions || loadingBudgets || loadingBudgetHistorics) && (
        <div style={circularProgressStyle}>
          <CircularProgress />
        </div>
      )}
      <div style={containerStyle}>
        {!(loadingTransactions || loadingBudgets || loadingBudgetHistorics) && data.length === 0 ? (
          <p>No hay datos para mostrar</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
              style={{
                fontSize: '14px'
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" xAxisId={0} />
              <XAxis dataKey="name" xAxisId={1} hide />
              <YAxis unit={' €'} />
              <Tooltip content={props => <CustomTooltip {...props} />} />
              <Legend />
              <Bar dataKey="Presupuestado" barSize={40} xAxisId={0} fill="#00C49F" />
              <Bar dataKey="Gastado" barSize={40} xAxisId={1} fill="#FF6384">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.Gastado >= entry.Presupuestado ? '#FF0042' : '#FF6384'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </BasicCard>
  )
}

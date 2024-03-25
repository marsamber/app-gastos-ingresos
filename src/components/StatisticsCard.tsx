import { useMediaQuery } from '@mui/material'
import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { Legend, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export default function StatisticsCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

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

  const data = [
    { name: 'Compras online', value: 200 },
    { name: 'Entretenimiento', value: 150 },
    { name: 'Viajes', value: 300 },
    { name: 'Compras varias', value: 400 },
    { name: 'Alimentación', value: 300 },
    { name: 'Restaurantes', value: 300 },
    { name: 'Gastos inesperados', value: 200 },
    { name: 'Ocio', value: 100 },
    { name: 'Transporte', value: 100 },
    { name: 'Salud', value: 100 },
    { name: 'Educación', value: 100 }
  ]

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#FF6384',
    '#36A2EB',
    '#FF9F40',
    '#4BC0C0',
    '#FFD700',
    '#FF69B4',
    '#90EE90'
  ]

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p><b>{data.name}</b>: {data.value} €</p>
        </div>
      )
    }
  }

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Estadísticas por categoría</h3>
      <div style={containerStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            width={400}
            height={isTablet ? 500 : 300}
            style={{
              fontSize: '14px'
            }}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip content={props => <CustomTooltip {...props} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </BasicCard>
  )
}

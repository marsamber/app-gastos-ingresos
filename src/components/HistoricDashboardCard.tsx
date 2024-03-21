import { useMediaQuery } from '@mui/material'
import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function HistoricDashboardCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

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

  // mock data (replace with last 12 months data from the API)
  const data = [
    {
      name: 'Abril 23',
      'Gastado (€)': 1500
    },
    {
      name: 'Mayo 23',
      'Gastado (€)': 1000
    },
    {
      name: 'Junio 23',
      'Gastado (€)': 1800
    },
    {
      name: 'Julio 23',
      'Gastado (€)': 2000
    },
    {
      name: 'Agosto 23',
      'Gastado (€)': 2500
    },
    {
      name: 'Septiembre 23',
      'Gastado (€)': 3000
    },
    {
      name: 'Octubre 23',
      'Gastado (€)': 2800
    },
    {
      name: 'Noviembre 23',
      'Gastado (€)': 2020
    },
    {
      name: 'Diciembre 23',
      'Gastado (€)': 1800
    },
    {
      name: 'Enero 24',
      'Gastado (€)': 500
    },
    {
      name: 'Febrero 24',
      'Gastado (€)': 800
    },
    {
      name: 'Marzo 24',
      'Gastado (€)': 2010
    },
  ]

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Gastos mensuales</h3>
      <div style={containerStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="Gastado (€)" stroke="#FF6384" fill="#FF8042" />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BasicCard>
  )
}

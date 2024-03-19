import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { useMediaQuery } from '@mui/material'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function MonthDashboardCard() {
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
    {
      name: '1',
      'Gastado (€)': 200
    },
    {
      name: '2',
      'Gastado (€)': 300
    },
    {
      name: '3',
      'Gastado (€)': 100
    },
    {
      name: '4',
      'Gastado (€)': 400
    },
    {
      name: '5',
      'Gastado (€)': 200
    }
  ]

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Resumen del mes (semanas)</h3>
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Gastado (€)" barSize={50} fill="#36A2EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BasicCard>
  )
}

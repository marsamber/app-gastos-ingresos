import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { useMediaQuery } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function BudgetCard() {
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
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    height: isTablet ? '400px' : '350px'
  }

  const data = [
    {
      name: 'Compras varias',
      Gastado: 400,
      Presupuestado: 500
    },
    {
      name: 'Alimentación',
      Gastado: 300,
      Presupuestado: 500
    },
    {
      name: 'Restaurantes',
      Gastado: 300,
      Presupuestado: 500
    },
    {
      name: 'Gastos inesperados',
      Gastado: 200,
      Presupuestado: 500
    },
    {
      name: 'Ocio',
      Gastado: 100,
      Presupuestado: 500
    },
    {
      name: 'Transporte',
      Gastado: 100,
      Presupuestado: 500
    },
    {
      name: 'Salud',
      Gastado: 100,
      Presupuestado: 500
    },
    {
      name: 'Educación',
      Gastado: 100,
      Presupuestado: 500
    }
  ]

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Presupuesto</h3>
      <div style={containerStyle}>
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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Gastado" barSize={50} stackId="a" fill="#FF6384" />
            <Bar dataKey="Presupuestado" barSize={50} stackId="a" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BasicCard>
  )
}

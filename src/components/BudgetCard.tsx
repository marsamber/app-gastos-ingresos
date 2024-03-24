import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { useMediaQuery } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

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
      name: 'Compras online',
      Gastado: 200,
      Presupuestado: 500
    },
    {
      name: 'Entretenimiento',
      Gastado: 150,
      Presupuestado: 500
    },
    {
      name: 'Viajes',
      Gastado: 300,
      Presupuestado: 500
    },
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

  const CustomTooltip = ({ active, payload, label }:TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const gastado: number  = Number(payload.find(entry => entry.name === 'Gastado')?.value) || 0;
      const presupuestado: number = Number(payload.find(entry => entry.name === 'Presupuestado')?.value) || 0;
      const restante: number  = presupuestado - gastado;
  
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <b className="label">{`${label}`}</b>
          <p className="intro" style={{color: '#00C49F'}}>{`Presupuestado: ${presupuestado} €`}</p>
          <p className="intro" style={{color: '#FF6384'}}>{`Gastado: ${gastado} €`}</p>
          <p className="intro" style={{color: restante <=0 ?  'red': 'black'}}>{`Restante: ${restante} €`}</p>
        </div>
      );
    }
  }

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
            <XAxis dataKey="name" xAxisId={0} />
            <XAxis dataKey="name" xAxisId={1} hide />
            <YAxis unit={' €'} />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Legend />
            <Bar dataKey="Presupuestado" barSize={40} xAxisId={0} fill="#00C49F" />
            <Bar dataKey="Gastado" barSize={40} xAxisId={1} fill="#FF6384" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BasicCard>
  )
}

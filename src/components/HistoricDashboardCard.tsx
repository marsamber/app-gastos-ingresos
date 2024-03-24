import { useMediaQuery } from '@mui/material'
import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

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
      'Gastado': 1500,
      'Presupuestado': 2000
    },
    {
      name: 'Mayo 23',
      'Gastado': 1000,
      'Presupuestado': 1200
    },
    {
      name: 'Junio 23',
      'Gastado': 1800,
      'Presupuestado': 1500
    },
    {
      name: 'Julio 23',
      'Gastado': 2000,
      'Presupuestado': 2200
    },
    {
      name: 'Agosto 23',
      'Gastado': 2500,
      'Presupuestado': 2400
    },
    {
      name: 'Septiembre 23',
      'Gastado': 3000,
      'Presupuestado': 2800
    },
    {
      name: 'Octubre 23',
      'Gastado': 2800,
      'Presupuestado': 3000
    },
    {
      name: 'Noviembre 23',
      'Gastado': 2020,
      'Presupuestado': 2000
    },
    {
      name: 'Diciembre 23',
      'Gastado': 1800,
      'Presupuestado': 1900
    },
    {
      name: 'Enero 24',
      'Gastado': 500,
      'Presupuestado': 800
    },
    {
      name: 'Febrero 24',
      'Gastado': 800,
      'Presupuestado': 1000
    },
    {
      name: 'Marzo 24',
      'Gastado': 2010,
      'Presupuestado': 1800
    },
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
      <h3 style={titleStyle}>Gastos mensuales</h3>
      <div style={containerStyle}>
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
            <YAxis unit=' €' />
            <Tooltip  content={(props) => <CustomTooltip {...props} />}/>
            <Bar dataKey="Presupuestado" barSize={40} xAxisId={0} fill="#00C49F" />
            <Bar dataKey="Gastado" barSize={40} xAxisId={1} fill="#FF6384" />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BasicCard>
  )
}

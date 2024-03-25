import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { Button, useMediaQuery } from '@mui/material'
import { Add } from '@mui/icons-material'
import FixedOutcomesTable from '../table/FixedOutcomesTable'

export default function FixedOutcomesCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const cardStyle = {
    width: '100%'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  }

  return (
    <BasicCard style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Gastos fijos</h3>
        <Button variant="contained" color="error" endIcon={<Add />}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <FixedOutcomesTable />
      </div>
    </BasicCard>
  )
}

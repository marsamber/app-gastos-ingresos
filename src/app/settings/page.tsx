'use client'
import { useMediaQuery } from '@mui/material'
import { CSSProperties, useState } from 'react'
import '../../styles.css'

export default function Settings() {
  const [value, setValue] = useState(0)
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0',
    color: 'black'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '10px'
  }

  return (
    <main className='main'>
      <h2 style={titleStyle}>Configuración</h2>
      <div style={containerStyle}></div>
    </main>
  )
}

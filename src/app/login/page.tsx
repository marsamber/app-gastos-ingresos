'use client'
import { RefreshContext } from '@/contexts/RefreshContext'
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FormEvent, useContext, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('' as string)
  const { updateApiKey } = useContext(RefreshContext)

  const saveToken = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const { success } = await response.json()

    if (success) {
      updateApiKey(password)
      router.push('/')
    } else {
      setPassword('')
      alert('Clave incorrecta')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#F7F9FB'
      }}
    >
      <Card
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '10px'
        }}
      >
        <form onSubmit={saveToken}>
          <CardContent>
            <TextField type="password" label="Clave" onChange={event => setPassword(event.target.value)} required />
          </CardContent>
          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button variant="contained" color="primary" type="submit">
              Inicia sesión
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  )
}

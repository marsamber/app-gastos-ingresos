'use client'
import { TextField } from '@mui/material'
import { Button, Card, CardContent, CardActions } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('' as string)

  const saveToken = () => {
    if (password === 'my-password') {
      localStorage.setItem('token', password)
      router.push('/')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Card>
        <CardContent>
          <TextField type="password" label="Password" onChange={event => setPassword(event.target.value)} />
        </CardContent>
        <CardActions
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button variant="contained" color="primary" onClick={saveToken}>
            Inicia sesión
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

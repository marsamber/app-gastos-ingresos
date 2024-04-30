'use client'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const saveToken = () => {
    const token = process.env.NEXT_PUBLIC_TOKEN
    if (!token) {
      return
    }
    localStorage.setItem('token', token)
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button variant="contained" color="primary" onClick={saveToken}>
        Inicia sesión
      </Button>
    </div>
  )
}

// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_KEY = process.env.API_KEY // Asegúrate de configurar esto en tu .env

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lista de rutas que no requieren autenticación
  const openPaths = ['/api/login', '/api/update_historic']

  if (openPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Aplica el middleware a todas las rutas bajo `/api` excepto `/api/login`
  if (pathname.startsWith('/api')) {
    const apiKey = request.headers.get('x-api-key')

    if (!apiKey || apiKey !== API_KEY) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next()
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import ResponsiveDrawer from '@/components/ResponsiveDrawer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mi app de gastos',
  description: 'Una app para llevar el control de tus gastos'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ResponsiveDrawer>{children}</ResponsiveDrawer>
      </body>
    </html>
  )
}

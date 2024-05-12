'use client'
import { RefreshTransactionsContext } from '@/contexts/RefreshTransactionsContext'
import theme from '@/theme'
import { Add, Calculate, CreditCard, CurrencyExchange, Home, Logout, Settings } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { Fab, ThemeProvider } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { usePathname } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import TransactionModal from './modal/TransactionModal'

const drawerWidth = 240

export default function ResponsiveDrawer({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const pathname = usePathname()
  const [addTransaction, setAddTransaction] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshTransactions = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('token') && pathname !== '/login') {
      window.location.href = '/login'
      return
    }
    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'my-password') {
      window.location.href = '/login'
      return
    }
  }, [])

  const drawer = (
    <div>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <CreditCard /> Mi app de gastos
      </Toolbar>
      <Divider />
      <List>
        <ListItem key="Inicio" disablePadding>
          <ListItemButton
            style={{
              backgroundColor: pathname === '/' ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              color: pathname === '/' ? 'black' : 'gray'
            }}
            href="/"
          >
            <ListItemIcon>
              <Home style={{ color: pathname === '/' ? 'black' : 'gray' }} />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Transacciones" disablePadding>
          <ListItemButton
            style={{
              backgroundColor: pathname === '/transactions' ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              color: pathname === '/transactions' ? 'black' : 'gray'
            }}
            href="/transactions"
          >
            <ListItemIcon>
              <CurrencyExchange style={{ color: pathname === '/transactions' ? 'black' : 'gray' }} />
            </ListItemIcon>
            <ListItemText primary="Transacciones" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Presupuesto" disablePadding>
          <ListItemButton
            style={{
              backgroundColor: pathname === '/budget' ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              color: pathname === '/budget' ? 'black' : 'gray'
            }}
            href="/budget"
          >
            <ListItemIcon>
              <Calculate style={{ color: pathname === '/budget' ? 'black' : 'gray' }} />
            </ListItemIcon>
            <ListItemText primary="Presupuesto" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Configuración" disablePadding>
          <ListItemButton
            style={{
              backgroundColor: pathname === '/settings' ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              color: pathname === '/settings' ? 'black' : 'gray'
            }}
            href="/settings"
          >
            <ListItemIcon>
              <Settings style={{ color: pathname === '/settings' ? 'black' : 'gray' }} />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="Cerrar sesión" disablePadding>
          <ListItemButton
            style={{
              backgroundColor: 'inherit',
              color:'gray'
            }}
            href="/login"
            onClick={() => localStorage.removeItem('token')}
          >
            <ListItemIcon>
              <Logout style={{ color: 'gray' }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  const isLogin = pathname === '/login'

  return (
    <ThemeProvider theme={theme}>
      <RefreshTransactionsContext.Provider value={{ refreshKey, refreshTransactions }}>
        {isLogin ? (
          children
        ) : (
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
              color="inherit"
              position="fixed"
              sx={{
                display: { xs: 'block', sm: 'block', md: 'none' },
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` }
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: 'none' } }}
                >
                  <MenuIcon style={{ color: 'black' }} />
                </IconButton>
                <Typography variant="h6" noWrap component="div" color="black">
                  {pathname === '/'
                    ? 'Inicio'
                    : pathname === '/transactions'
                      ? 'Transacciones'
                      : pathname === '/budget'
                        ? 'Presupuesto'
                        : pathname === '/settings'
                          ? 'Configuración'
                          : '404'}
                </Typography>
              </Toolbar>
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
              aria-label="mailbox folders"
            >
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                  keepMounted: true
                }}
                sx={{
                  display: { xs: 'block', sm: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'none', md: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)`, backgroundColor: '#F7F9FB' } }}
            >
              <Toolbar
                sx={{
                  display: { xs: 'block', sm: 'block', md: 'none' }
                }}
              />
              {children}
            </Box>
            <Fab
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px'
              }}
              color="primary"
              onClick={() => setAddTransaction(true)}
            >
              <Add />
            </Fab>
            <TransactionModal open={addTransaction} handleClose={() => setAddTransaction(false)} />
          </Box>
        )}
      </RefreshTransactionsContext.Provider>
    </ThemeProvider>
  )
}

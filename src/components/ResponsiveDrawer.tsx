'use client'
import * as React from 'react'
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
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Calculate, CreditCard, CurrencyExchange, Home, Settings } from '@mui/icons-material'
import { usePathname } from 'next/navigation'

const drawerWidth = 240

export default function ResponsiveDrawer({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const pathname = usePathname()

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
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        color="inherit"
        position="fixed"
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
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
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)`, backgroundColor: 'white' } }}
      >
        <Toolbar
          sx={{
            display: { xs: 'block', sm: 'none' }
          }}
        />
        {children}
      </Box>
    </Box>
  )
}

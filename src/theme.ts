import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#257CA3',
      light: '#4A9ABE'
    },
    secondary: {
      main: '#3f51b5'
    },
    error: {
      main: '#f44336'
    }
  },
  components: {
    MuiTablePagination: {
      styleOverrides: {
        root: {
          margin: '0 10px 0 5px'
        },
        actions: {
          margin: 0
        },
        toolbar: {
          padding: 0
        },
      }
    },
    MuiModal: {
      styleOverrides: {
        root: {
          borderRadius: 4
        },
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#257CA3'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        "root": {
          "&.Mui-selected": {
            "color": "#257CA3"
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: 'transparent'
          },
          "&.Mui-selected": {
            backgroundColor: 'transparent'
          },
          "&.Mui-focusVisible": {
            backgroundColor: 'transparent'
          }
        }
      }
    },
  }
})

export default theme

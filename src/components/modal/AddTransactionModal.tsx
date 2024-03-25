import { CSSProperties, useEffect, useState } from 'react'
import BasicModal from './BasicModal'
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import { format } from 'path'

export interface AddTransactionModalProps {
  open: boolean
  handleClose: () => void
  transactionType?: string
}

export default function AddTransactionModal({ open, handleClose, transactionType }: AddTransactionModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [type, setType] = useState(transactionType || 'outcome')
  const [amount, setAmount] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  // const { addTransaction } = useTransactions()
  // const { user } = useAuth()
  // const { enqueueSnackbar } = useSnackbar()
  // const classes = useStyles()
  // const theme = useTheme()
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setType(transactionType || 'outcome')
  }, [transactionType])

  const handleAddTransaction = async () => {
    if (!amount || !description) {
      setError(true)
      return
    }
    setError(false)
    setLoading(true)
    // try {
    //     await addTransaction({
    //     amount: parseFloat(amount),
    //     description,
    //     date,
    //     type,
    //     userId: user.id
    //     })
    //     enqueueSnackbar('Transacción agregada', { variant: 'success' })
    //     handleClose()
    // } catch (error) {
    //     enqueueSnackbar('Hubo un error
    //     al agregar la transacción', { variant: 'error' })
    // }
    setLoading(false)
  }

  const handleCloseModal = () => {
    setError(false)
    handleClose()
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '500px',
    height: isMobile ? '415px' : '300px'
  }

  const firstRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: '10px'
  }

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 8px 0px 8px'
  }

  return (
    <BasicModal open={open} style={modalStyle}>
      <div>
        <h3 style={titleStyle}>Agregar transacción</h3>
        <div style={firstRowStyle}>
          <FormControl style={{ width: isMobile ? '192px' : '110px', margin: '8px' }} size="small">
            <InputLabel id="type-label" color="error">
              Tipo
            </InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Tipo"
              onChange={e => setType(e.target.value)}
              color="error"
            >
              <MenuItem value="income">Ingreso</MenuItem>
              <MenuItem value="outcome">Gasto</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ width: isMobile ? '192px' : '115px', margin: '8px' }}
            size="small"
            color="error"
            label="Cantidad"
            type="number"
            value={amount}
            error={error}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />
          <TextField
            style={{ width: isMobile ? '192px' : '143px', margin: '8px' }}
            size="small"
            color="error"
            label="Fecha"
            type="date"
            value={formatDate(date)}
            onChange={e => setDate(new Date(e.target.value))}
          />
        </div>
        <div style={firstRowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '420px', margin: '8px' }}
            size="small"
            color="error"
            label="Descripción"
            value={description}
            error={error}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div style={actionsStyle}>
          <Button variant="contained" color="error" onClick={handleAddTransaction} disabled={loading}>
            Agregar
          </Button>
          <Button variant="text" color="error" onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}

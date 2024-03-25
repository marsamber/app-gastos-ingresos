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

export interface AddFixedTransactionModalProps {
  open: boolean
  handleClose: () => void
  transactionType?: string
}

export default function AddFixedTransactionModal({ open, handleClose, transactionType }: AddFixedTransactionModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [type, setType] = useState(transactionType || 'outcome')
  const [amount, setAmount] = useState<number | null>(null)
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
    if (!amount) {
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

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '331px',
    height: isMobile ? '300px' : '250px'
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
        <h3 style={titleStyle}>Agregar {transactionType === 'income' ? 'ingreso fijo' : 'gasto fijo'}</h3>
        <div style={firstRowStyle}>
          <FormControl style={{ width: isMobile ? '192px' : '110px', margin: '8px' }} size="small">
            <InputLabel id="type-label" color="error">
              Tipo
            </InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Tipo"
              disabled={transactionType !== undefined}
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

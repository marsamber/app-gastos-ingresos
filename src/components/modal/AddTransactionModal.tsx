import useFetch from '@/hooks/useFetch'
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery
} from '@mui/material'
import { CSSProperties, ChangeEvent, useContext, useEffect, useState } from 'react'
import BasicModal from './BasicModal'
import { ITransaction } from '@/types/index'
import { TransactionContext } from '@/contexts/TransactionContext'

export interface AddTransactionModalProps {
  open: boolean
  handleClose: () => void
}

export default function AddTransactionModal({ open, handleClose }: AddTransactionModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState<string>('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [errorAmount, setErrorAmount] = useState(false)
  const [errorDate, setErrorDate] = useState(false)
  const [errorTitle, setErrorTitle] = useState(false)
  const [errorCategory, setErrorCategory] = useState(false)

  const { data: categories, loading: loadingCategories } = useFetch<string[]>('/api/categories')

  const { refreshTransactions } = useContext(TransactionContext)

  const handleAddTransaction = async () => {
    if (!amount || !title || !category || !date) {
      setErrorAmount(!amount || amount === '-')
      setErrorTitle(!title)
      setErrorCategory(!category)
      setErrorDate(!date || date.toString() === 'Invalid Date')
      return
    }

    setErrorAmount(false)
    setErrorTitle(false)
    setErrorCategory(false)
    setErrorDate(false)

    setLoading(true)

    const newTransaction = {
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString()
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
      })
      const data = await response.json()

      if (response.ok) {
        refreshTransactions()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Failed to add transaction', error)
    }

    setLoading(false)
  }

  const handleCloseModal = () => {
    setErrorAmount(false)
    setErrorTitle(false)
    setErrorCategory(false)
    setErrorDate(false)

    setAmount('')
    setTitle('')
    setCategory('')
    setDate(new Date())

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

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue === '' || newValue === '-') {
      setAmount(newValue)
    }
    if (/^-?\d*\.?\d*$/.test(newValue)) {
      setAmount(newValue)
      
      const value = parseFloat(newValue)
      if (value < 0) {
        setType('expense')
      } else {
        setType('income')
      }
    }
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '500px',
    height: isMobile ? '480px' : '300px'
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

  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <BasicModal open={open} style={modalStyle}>
      <div>
        <h3 style={titleStyle}>Agregar transacción</h3>
        {loadingCategories && <CircularProgress style={circularProgressStyle} />}
        <div style={firstRowStyle}>
          <FormControl style={{ width: isMobile ? '192px' : '110px', margin: '8px' }} size="small" disabled>
            <InputLabel id="type-label" color="error">
              Tipo
            </InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Tipo"
              onChange={e => setType(e.target.value as 'income' | 'expense')}
              color="error"
            >
              <MenuItem value="income">Ingreso</MenuItem>
              <MenuItem value="expense">Gasto</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ width: isMobile ? '192px' : '115px', margin: '8px' }}
            size="small"
            color="error"
            label="Cantidad"
            type="text"
            value={amount}
            error={errorAmount}
            onChange={e => handleChangeAmount(e)}
            inputProps={{
              pattern: '^-?\\d*\\.?\\d*$'
            }}
          />
          <TextField
            style={{ width: isMobile ? '192px' : '143px', margin: '8px' }}
            size="small"
            color="error"
            label="Fecha"
            type="date"
            error={errorDate}
            value={formatDate(date)}
            onChange={e => setDate(new Date(e.target.value))}
          />
        </div>
        <div style={firstRowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '194px', margin: '8px' }}
            size="small"
            color="error"
            label="Título"
            value={title}
            error={errorTitle}
            onChange={e => setTitle(e.target.value)}
          />
          {categories && categories.length > 0 ? (
            <FormControl style={{ width: isMobile ? '192px' : '200px', margin: '8px' }} size="small">
              <InputLabel id="category-label" color="error">
                Categoría
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Categoría"
                onChange={e => setCategory(e.target.value)}
                color="error"
                error={errorCategory}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <div>Cargando categorías...</div>
          )}
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

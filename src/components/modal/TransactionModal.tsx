import { RefreshTransactionsContext } from '@/contexts/RefreshTransactionsContext'
import useFetch from '@/hooks/useFetch'
import { ITransaction } from '@/types/index'
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

interface TransactionModalProps {
  open: boolean
  handleClose: () => void
  transaction?: ITransaction | null
}

export default function TransactionModal({ open, handleClose, transaction }: TransactionModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState<string>('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ amount: false, date: false, title: false, category: false })

  const { data: categories, loading: loadingCategories } = useFetch<string[]>('/api/categories')
  const { refreshTransactions } = useContext(RefreshTransactionsContext)

  useEffect(() => {
    if (transaction) {
      setType(transaction.amount < 0 ? 'expense' : 'income')
      setAmount(transaction.amount.toString())
      setTitle(transaction.title)
      setCategory(transaction.category)
      setDate(new Date(transaction.date))
    } else {
      setType('income')
      setAmount('')
      setTitle('')
      setCategory('')
      setDate(new Date())
    }
  }, [transaction, open])

  const handleSaveTransaction = async () => {
    if (!amount || !title || !category || !date) {
      setErrors({
        amount: !amount,
        title: !title,
        category: !category,
        date: date.toString() === 'Invalid Date'
      })
      return
    }

    setLoading(true)

    const transactionData = {
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString()
    }

    try {
      const response = await fetch(transaction ? `/api/transactions/${transaction.id}` : '/api/transactions', {
        method: transaction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      })
      if (response.ok) {
        refreshTransactions()
        handleClose()
      }
    } catch (error) {
      console.error('Failed to save transaction', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    if (/^-?\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setType(parseFloat(value) < 0 ? 'expense' : 'income')
    }
  }
  
  const handleCloseModal = () => {
    setErrors({ amount: false, date: false, title: false, category: false })

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
    <BasicModal open={open} style={modalStyle} handleClose={handleCloseModal}>
      <div>
        <h3 style={titleStyle}>Editar transacción</h3>
        {loadingCategories && <CircularProgress style={circularProgressStyle} />}
        <div style={firstRowStyle}>
          <FormControl style={{ width: isMobile ? '192px' : '110px', margin: '8px' }} size="small" disabled>
            <InputLabel id="type-label" color="primary">
              Tipo
            </InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Tipo"
              onChange={e => setType(e.target.value as 'income' | 'expense')}
              color="primary"
            >
              <MenuItem value="income">Ingreso</MenuItem>
              <MenuItem value="expense">Gasto</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ width: isMobile ? '192px' : '115px', margin: '8px' }}
            size="small"
            color="primary"
            label="Cantidad"
            type="text"
            value={amount}
            error={errors.amount}
            onChange={e => handleChangeAmount(e)}
            inputProps={{
              pattern: '^-?\\d*\\.?\\d*$'
            }}
          />
          <TextField
            style={{ width: isMobile ? '192px' : '143px', margin: '8px' }}
            size="small"
            color="primary"
            label="Fecha"
            type="date"
            error={errors.date}
            value={formatDate(date as Date)}
            onChange={e => setDate(new Date(e.target.value))}
          />
        </div>
        <div style={firstRowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '194px', margin: '8px' }}
            size="small"
            color="primary"
            label="Título"
            value={title}
            error={errors.title}
            onChange={e => setTitle(e.target.value)}
          />
          {categories && categories.length > 0 ? (
            <FormControl style={{ width: isMobile ? '192px' : '200px', margin: '8px' }} size="small">
              <InputLabel id="category-label" color="primary">
                Categoría
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Categoría"
                onChange={e => setCategory(e.target.value)}
                color="primary"
                error={errors.category}
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
          <Button variant="contained" color="primary" onClick={handleSaveTransaction} disabled={loading}>
            Agregar
          </Button>
          <Button variant="text" color="primary" onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}
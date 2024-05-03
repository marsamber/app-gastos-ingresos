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

export interface EditTransactionModalProps {
  open: boolean
  handleClose: () => void
  transaction: ITransaction | null
}

export default function EditTransactionModal({ open, handleClose, transaction }: EditTransactionModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState<number | null>(0)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [errorAmount, setErrorAmount] = useState(false)
  const [errorDate, setErrorDate] = useState(false)
  const [errorTitle, setErrorTitle] = useState(false)
  const [errorCategory, setErrorCategory] = useState(false)

  const { data: categories, loading: loadingCategories } = useFetch<string[]>('/api/categories')

  const { refreshTransactions } = useContext(RefreshTransactionsContext)

  useEffect(() => {
    if (transaction) {
      setType(transaction.amount < 0 ? 'expense' : 'income')
      setAmount(transaction.amount)
      setTitle(transaction.title)
      setCategory(transaction.category)
      setDate(new Date(transaction.date))
    }
  }, [transaction])

  const handleEditTransaction = async () => {
    if (!amount || !title || !category || !date) {
      setErrorAmount(!amount)
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

    const updatedTransaction = {
      title,
      amount,
      category,
      date: date
    }

    try {
      const response = await fetch(`/api/transactions/${transaction?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTransaction)
      })
      await response.json()

      if (response.ok) {
        refreshTransactions()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Failed to edit transaction', error)
    }

    setLoading(false)
  }

  const handleCloseModal = () => {
    setErrorAmount(false)
    setErrorTitle(false)
    setErrorCategory(false)
    setErrorDate(false)

    setAmount(0)
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
    const value = parseFloat(e.target.value)
    if (value < 0) {
      setType('expense')
    } else {
      setType('income')
    }
    setAmount(value)
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
            type="number"
            value={amount}
            error={errorAmount}
            onChange={e => handleChangeAmount(e)}
          />
          <TextField
            style={{ width: isMobile ? '192px' : '143px', margin: '8px' }}
            size="small"
            color="primary"
            label="Fecha"
            type="date"
            error={errorDate}
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
            error={errorTitle}
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
          <Button variant="contained" color="primary" onClick={handleEditTransaction} disabled={loading}>
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

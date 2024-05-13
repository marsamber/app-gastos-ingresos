import { TransactionsContext } from '@/contexts/TransactionsContext'
import { ITransaction } from '@/types/index'
import { Autocomplete, Button, TextField, useMediaQuery } from '@mui/material'
import { CSSProperties, ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from 'react'
import BasicModal from './BasicModal'
import { RefreshContext } from '@/contexts/RefreshContext'

interface TransactionModalProps {
  open: boolean
  handleClose: () => void
  transaction?: ITransaction | null
}

export default function TransactionModal({ open, handleClose, transaction }: TransactionModalProps) {
  const inputRef = useRef<HTMLInputElement>()

  const isMobile = useMediaQuery('(max-width: 600px)')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState<string>('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ amount: false, date: false, title: false, category: false })
  const [categories, setCategories] = useState<string[] | null>(null)

  const { addTransaction, editTransaction } = useContext(TransactionsContext)
  const { refreshTransactions, refreshKeyCategories } = useContext(RefreshContext)

  const categoriesOptions = useMemo(
    () =>
      categories
        ?.map(category => ({ value: category, label: category }))
        .sort((a, b) => a.label.localeCompare(b.label)) || [],
    [categories]
  )

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')      
      if (response.ok) {
        const categories = await response.json()
        setCategories(categories)
      }
    }

    fetchCategories()
  }, [refreshKeyCategories])

  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 200)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [open])

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
        if (transaction) {
          const updatedTransaction = await response.json()
          editTransaction(updatedTransaction)
        } else {
          const newTransaction: ITransaction[] = await response.json()
          addTransaction(newTransaction[0])
        }

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
    height: isMobile ? '500px' : '300px'
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
    <BasicModal open={open} style={modalStyle} handleClose={handleCloseModal}>
      <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' } : {}}>
        <h3 style={titleStyle}>{transaction ? 'Editar transacción' : 'Agregar transacción'}</h3>
        <div style={firstRowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '194px', margin: '8px' }}
            size="small"
            color="primary"
            label="Título"
            value={title}
            error={errors.title}
            onChange={e => setTitle(e.target.value)}
            inputRef={inputRef}
          />
          {categories && categories.length > 0 ? (
            <Autocomplete
              style={{ width: isMobile ? '192px' : '200px', margin: '8px' }}
              size="small"
              options={categoriesOptions}
              getOptionLabel={option => option.label}
              value={categoriesOptions.find(opt => opt.value === category)}
              onChange={(event, newValue) => setCategory(newValue.value)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderInput={params => <TextField {...params} label="Categoría" error={errors.category} />}
              disableClearable
            />
          ) : (
            <div>Cargando categorías...</div>
          )}
        </div>
        <div style={firstRowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '110px', margin: '8px' }}
            disabled
            size="small"
            color="primary"
            label="Tipo"
            type="text"
            value={type === 'income' ? 'Ingreso' : 'Gasto'}
          />
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
        <div style={actionsStyle}>
          <Button variant="contained" color="primary" onClick={handleSaveTransaction} disabled={loading}>
            {transaction ? 'Editar' : 'Agregar'}
          </Button>
          <Button variant="text" color="primary" onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}

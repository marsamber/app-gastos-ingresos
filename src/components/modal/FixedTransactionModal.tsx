import { RefreshSettingsContext } from '@/contexts/RefreshSettingsContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import { IMonthlyTransaction } from '@/types/index'
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import { CSSProperties, ChangeEvent, useContext, useEffect, useState } from 'react'
import BasicModal from './BasicModal'

interface FixedTransactionModalProps {
  open: boolean
  handleClose: () => void
  transactionType: 'income' | 'expense'
  monthlyTransaction?: IMonthlyTransaction | null
}

export default function FixedTransactionModal({
  open,
  handleClose,
  transactionType,
  monthlyTransaction = null
}: FixedTransactionModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ amount: false, title: false, category: false })

  const { categories, loadingCategories } = useContext(SettingsContext)
  const { refreshMonthlyTransactions } = useContext(RefreshSettingsContext)

  useEffect(() => {
    if (monthlyTransaction) {
      setAmount(monthlyTransaction.amount.toString())
      setTitle(monthlyTransaction.title)
      setCategory(monthlyTransaction.category)
    } else {
      setAmount('')
      setTitle('')
      setCategory(transactionType === 'income' ? 'Ingresos fijos' : '')
    }
  }, [monthlyTransaction, open, transactionType])

  const handleSaveTransaction = async () => {
    if (!amount || !title || !category) {
      setErrors({ amount: !amount, title: !title, category: !category })
      return
    }

    setLoading(true)
    const transactionData = { title, amount: parseFloat(amount), category }

    try {
      const method = monthlyTransaction ? 'PUT' : 'POST'
      const url = monthlyTransaction
        ? `/api/monthly_transactions/${monthlyTransaction.id}`
        : '/api/monthly_transactions'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      })
      await response.json()
      if (response.ok) {
        refreshMonthlyTransactions()
        handleClose()
      }
    } catch (error) {
      console.error('Failed to process transaction', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value

    if (transactionType === 'income' && /^\d*\.?\d*$/.test(newValue)) {
      setAmount(newValue)
    } else if (transactionType === 'expense' && /^-\d*\.?\d*$/.test(newValue)) {
      setAmount(newValue)
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

  const rowStyle: CSSProperties = {
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
    <BasicModal open={open} handleClose={handleClose} style={modalStyle}>
      <div>
        <h3 style={titleStyle}>{monthlyTransaction ? 'Editar transacción' : 'Agregar transacción'}</h3>
        {loadingCategories ? (
          <CircularProgress style={circularProgressStyle} />
        ) : (
          <>
            <div style={rowStyle}>
              <FormControl style={{ width: isMobile ? '192px' : '194px', margin: '8px' }} size="small" disabled>
                <InputLabel id="type-label" color="primary">
                  Tipo
                </InputLabel>
                <Select labelId="type-label" value={transactionType} label="Tipo" color="primary">
                  <MenuItem value="income">Ingreso</MenuItem>
                  <MenuItem value="expense">Gasto</MenuItem>
                </Select>
              </FormControl>
              <TextField
                style={{ width: isMobile ? '192px' : '200px', margin: '8px' }}
                size="small"
                color="primary"
                label="Cantidad"
                type="text"
                value={amount}
                error={errors.amount}
                onChange={e => handleChangeAmount(e)}
                inputProps={{
                  pattern: transactionType === 'income' ? '^\\d*\\.?\\d*$' : '^-\\d*\\.?\\d*$'
                }}
              />
            </div>
            <div style={rowStyle}>
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
                <FormControl
                  style={{ width: isMobile ? '192px' : '200px', margin: '8px' }}
                  size="small"
                  disabled={transactionType === 'income'}
                >
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
                {monthlyTransaction ? 'Actualizar' : 'Agregar'}
              </Button>
              <Button variant="text" color="primary" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
            </div>
          </>
        )}
      </div>
    </BasicModal>
  )
}

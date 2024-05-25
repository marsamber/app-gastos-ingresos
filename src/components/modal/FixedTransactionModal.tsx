import { RefreshContext } from '@/contexts/RefreshContext'
import {
  SettingsMonthlyIncomeTransactionsContext
} from '@/contexts/SettingsMonthlyIncomeTransactionsContext'
import { ICategories, IMonthlyTransaction } from '@/types/index'
import customFetch from '@/utils/fetchWrapper'
import { Autocomplete, Button, TextField, useMediaQuery } from '@mui/material'
import { CSSProperties, ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from 'react'
import BasicModal from './BasicModal'
import { SettingsMonthlyExpenseTransactionsContext } from '@/contexts/SettingsMonthlyExpenseTransactionsContext'

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
  const inputRef = useRef<HTMLInputElement>()

  const isMobile = useMediaQuery('(max-width: 600px)')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ amount: false, title: false, category: false })

  const [categories, setCategories] = useState<string[] | null>(null)

  const {
    refreshMonthlyTransactions: refreshIncome,
    page: pageIncome,
    limit: limitIncome,
    sortBy: sortByIncome,
    sortOrder: sortOrderIncome
  } = useContext(SettingsMonthlyIncomeTransactionsContext)
  const {
    refreshMonthlyTransactions: refreshExpense,
    page: pageExpense,
    limit: limitExpense,
    sortBy: sortByExpense,
    sortOrder: sortOrderExpense
  } = useContext(SettingsMonthlyExpenseTransactionsContext)

  const { refreshKeyCategories } = useContext(RefreshContext)

  const categoriesOptions = useMemo(
    () =>
      categories
        ?.filter(category => category !== 'Sin categoría')
        .filter(category => (transactionType === 'expense' ? category !== 'Ingresos fijos' : true))
        .map(category => ({ value: category, label: category })) || [],
    [categories, transactionType]
  )

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await customFetch('/api/categories')

      if (response.ok) {
        const categoriesData: ICategories = await response.json()
        setCategories(categoriesData.categories.map(category => category.id))
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
      const response = await customFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      })

      if (response.ok) {
        if (transactionType === 'income') {
          refreshIncome(pageIncome, limitIncome, sortByIncome, sortOrderIncome)
        } else {
          refreshExpense(pageExpense, limitExpense, sortByExpense, sortOrderExpense)
        }
        handleCloseModal()
      }
    } catch (error) {
      console.error('Failed to process transaction', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setAmount('')
    setTitle('')
    setCategory('')
    setErrors({ amount: false, title: false, category: false })

    handleClose()
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

  return (
    <BasicModal open={open} handleClose={handleCloseModal} style={modalStyle}>
      <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' } : {}}>
        <h3 style={titleStyle}>{monthlyTransaction ? 'Editar transacción' : 'Agregar transacción'}</h3>
        <div style={rowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '194px', margin: '8px' }}
            size="small"
            color="primary"
            label="Título"
            value={title}
            error={errors.title}
            onChange={e => setTitle(e.target.value)}
            inputRef={inputRef}
            required
          />
          <Autocomplete
            style={{ width: isMobile ? '192px' : '200px', margin: '8px' }}
            size="small"
            options={categoriesOptions}
            getOptionLabel={option => option.label}
            value={categoriesOptions.find(opt => opt.value === category)}
            onChange={(event, newValue) => setCategory(newValue.value)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={params => (
              <TextField
                {...params}
                label="Categoría"
                error={errors.category}
                disabled={transactionType === 'income'}
                required
              />
            )}
            disableClearable
            disabled={transactionType === 'income'}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            style={{ width: isMobile ? '192px' : '194px', margin: '8px' }}
            disabled
            size="small"
            color="primary"
            label="Tipo"
            type="text"
            value={transactionType === 'income' ? 'Ingreso' : 'Gasto'}
            required
          />
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
            required
          />
        </div>
        <div style={actionsStyle}>
          <Button variant="contained" color="primary" onClick={handleSaveTransaction} disabled={loading}>
            {monthlyTransaction ? 'Actualizar' : 'Agregar'}
          </Button>
          <Button variant="text" color="primary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}

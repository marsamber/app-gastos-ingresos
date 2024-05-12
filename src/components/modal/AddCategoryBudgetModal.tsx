import { RefreshSettingsContext } from '@/contexts/RefreshSettingsContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import theme from '@/theme'
import { Autocomplete, Button, CircularProgress, TextField, createFilterOptions, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useMemo, useState } from 'react'
import BasicModal from './BasicModal'

export interface AddCategoryBudgetModalProps {
  open: boolean
  handleClose: () => void
}

interface CategoryType {
  inputValue?: string
  title: string
}

const filter = createFilterOptions<CategoryType>()

export default function AddCategoryBudgetModal({ open, handleClose }: AddCategoryBudgetModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [category, setCategory] = useState<CategoryType>({ title: '' })
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ category: false, amount: false, message: '' })

  const { loadingCategories, categories, budgets, monthSelected } = useContext(SettingsContext)
  const { refreshCategories, refreshBudgets } = useContext(RefreshSettingsContext)
  const currentDate = useMemo(() => new Date().toISOString().substring(0, 7), [])
  const present = useMemo(() => monthSelected.substring(0, 7) === currentDate, [monthSelected, currentDate])

  useEffect(() => {
    refreshBudgets() // Ensure budgets are updated when month changes
  }, [monthSelected])

  const categoriesOptions = useMemo(() => {
    const filteredCategories = categories
      .filter(
        category =>
          !budgets.some(budget => budget.category === category) &&
          category !== 'Ingresos fijos' &&
          category !== 'Sin categoría'
      )
      .sort((a, b) => a.localeCompare(b))
    return filteredCategories.map(category => ({ title: category, inputValue: category}))
  }, [categories, budgets, monthSelected])

  const handleAddCategoryBudget = async () => {
    if (!amount || !category.title) {
      setError({
        category: category.title === '',
        amount: amount === '',
        message: ''
      })
      return
    }

    const duplicateBudget = budgets.some(b => b.category === category.title)
    if (duplicateBudget) {
      setError({ ...error, message: 'Ya existe un presupuesto para esta categoría en el mes seleccionado.' })
      return
    }

    setLoading(true)
    const budgetData = {
      category: category.title,
      amount: parseFloat(amount),
      date: present ? undefined : new Date(monthSelected).toISOString()
    }

    const response = await fetch(present ? '/api/budgets' : '/api/budget_historics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData)
    })

    if (response.ok) {
      refreshCategories()
      refreshBudgets()
      handleCloseModal()
    } else {
      setError({ ...error, message: 'Error al guardar el presupuesto.' })
    }

    setLoading(false)
  }

  const handleCloseModal = () => {
    setError({ category: false, amount: false, message: '' })
    setCategory({ title: '' })
    setAmount('')
    handleClose()
  }

    // STYLES
    const titleStyle = {
      margin: '10px 0'
    }
  
    const modalStyle: CSSProperties = {
      width: isMobile ? '80%' : '411px',
      height: isMobile ?  '350px' : '250px'
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
    <BasicModal style={modalStyle} open={open} handleClose={handleCloseModal}>
      <div>
        <h3 style={titleStyle}>Agregar presupuesto</h3>
        {loadingCategories && <CircularProgress style={circularProgressStyle} />}
        <div style={rowStyle}>
        {!loadingCategories && (
          <Autocomplete
          style={{ width: isMobile ? '192px' : '200px', margin: '8px' }}
          size="small"
          value={category}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              // Direct string input from freeSolo
              setCategory({ title: newValue });
            } else if (newValue && newValue.inputValue) {
              // Input from user input not yet existing in options
              setCategory({ title: newValue.inputValue });
            } else {
              // Selection from existing options
              setCategory(newValue ?? { title: '' });
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(option => inputValue === option.title);
            if (inputValue !== '' && !isExisting) {
              // Suggest creating a new value
              filtered.push({
                inputValue,
                title: `Añade "${inputValue}"`
              });
            }
            return filtered;
          }}
          selectOnFocus
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={categoriesOptions}
          getOptionLabel={(option) => {
            // Ensure a string is always returned
            return typeof option === 'string' ? option : (option.inputValue || option.title);
          }}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => <TextField {...params} error={error.category} label="Categoría" />}
        />
        )}
        <TextField
          style={{ width: isMobile ? '192px' : '115px', margin: '8px' }}
          size="small"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          label="Cantidad"
          type="text"
          error={error.amount}
        />
        </div>
        <div style={{ textAlign: 'center', color: theme.palette.error.main, fontSize:'14px' }}>{error.message}</div>
        <div style={actionsStyle}>
          <Button variant="contained" color="primary" onClick={handleAddCategoryBudget} disabled={loading}>
            Agregar
          </Button>
          <Button color="primary" onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}

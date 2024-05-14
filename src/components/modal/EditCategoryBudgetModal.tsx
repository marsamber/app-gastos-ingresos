import { RefreshSettingsContext } from '@/contexts/RefreshSettingsContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import { IBudget } from '@/types/index'
import { Button, TextField, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import BasicModal from './BasicModal'
import { RefreshContext } from '@/contexts/RefreshContext'

export interface EditCategoryBudgetModalProps {
  open: boolean
  handleClose: () => void
  categoryBudget: IBudget | null
}

export default function EditCategoryBudgetModal({ open, handleClose, categoryBudget }: EditCategoryBudgetModalProps) {
  const inputRef = useRef<HTMLInputElement>()

  const isMobile = useMediaQuery('(max-width: 600px)')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [errorCategory, setErrorCategory] = useState(false)
  const [errorAmount, setErrorAmount] = useState(false)
  const [present, setPresent] = useState(false)

  const { categories, monthSelected, editBudget } = useContext(SettingsContext)
  const { refreshBudgets } = useContext(RefreshSettingsContext)
  const { apiKey } = useContext(RefreshContext)

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
    if (categoryBudget) {
      setCategory(categoryBudget.category)
      setAmount(categoryBudget.amount.toString())
    }
  }, [categoryBudget, open])

  const handleEditCategoryBudget = async () => {
    if (!amount || !category) {
      setErrorAmount(!amount)
      setErrorCategory(!category)

      return
    }
    setErrorAmount(false)
    setErrorCategory(false)

    setLoading(true)
    const newCategoryBudget = {
      category: category,
      amount: parseFloat(amount)
    }

    try {
      let response
      if (present) {
        response = await fetch(`/api/budgets/${categoryBudget?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || ''
          },
          body: JSON.stringify(newCategoryBudget)
        })
      } else {
        response = await fetch(`/api/budget_historics/${categoryBudget?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || ''
          },
          body: JSON.stringify(newCategoryBudget)
        })
      }
      const updatedBudget = await response.json()

      if (response.status === 401) {
        return
      }

      if (response.ok) {
        editBudget(updatedBudget)
        handleCloseModal()
      }
    } catch (error) {
      console.error('Failed to update budget', error)
    }

    setLoading(false)
  }

  const handleCloseModal = () => {
    setErrorAmount(false)
    setErrorCategory(false)

    setAmount('')
    setCategory('')

    handleClose()
  }

  const handleChangeAmount = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  useEffect(() => {
    const currentDate = new Date().toISOString().substring(0, 7)
    const dateSelected = monthSelected.substring(0, 7)
    setPresent(dateSelected === currentDate)
    refreshBudgets()
  }, [monthSelected])

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '411px',
    height: isMobile
      ? category === 'Nueva categoría'
        ? '350px'
        : '300px'
      : category === 'Nueva categoría'
        ? '300px'
        : '250px'
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
    <BasicModal open={open} style={modalStyle} handleClose={handleCloseModal}>
      <div>
        <h3 style={titleStyle}>Editar presupuesto</h3>
        <div style={rowStyle}>
          {categories && categories.length > 0 && (
            <TextField
              style={{ width: isMobile ? '192px' : '200px', margin: '8px' }}
              size="small"
              value={category}
              label="Categoría"
              color="primary"
              error={errorCategory}
              disabled
            />
          )}
          <TextField
            style={{ width: isMobile ? '192px' : '115px', margin: '8px' }}
            size="small"
            color="primary"
            label="Cantidad"
            type="text"
            inputProps={{
              pattern: '^\\d*\\.?\\d*$'
            }}
            value={amount}
            error={errorAmount}
            onChange={e => handleChangeAmount(e.target.value)}
            inputRef={inputRef}
          />
        </div>
        <div style={actionsStyle}>
          <Button variant="contained" color="primary" onClick={handleEditCategoryBudget} disabled={loading}>
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

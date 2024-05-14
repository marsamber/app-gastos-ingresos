import { RefreshContext } from '@/contexts/RefreshContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import theme from '@/theme'
import { Button, TextField, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import BasicModal from './BasicModal'

export interface AddCategoryModalProps {
  open: boolean
  handleClose: () => void
}

export default function AddCategoryModal({ open, handleClose }: AddCategoryModalProps) {
  const inputRef = useRef<HTMLInputElement>()

  const isMobile = useMediaQuery('(max-width: 600px)')
  const [category, setCategory] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ category: false, message: '' })

  const { categories, addCategory } = useContext(SettingsContext)

  const { refreshCategories, apiKey } = useContext(RefreshContext)

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

  const handleAddCategory = async () => {
    if (!category) {
      setError({
        category: true,
        message: ''
      })
      return
    }

    if (categories.includes(category)) {
      setError({
        category: true,
        message: 'La categoría ya existe.'
      })
      return
    }

    setLoading(true)
    // add new category
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || ''
        },
        body: JSON.stringify({
          category: category
        })
      })

      if (response.status === 401) {
        return
      }

      if (response.ok) {
        const newCategory = await response.json()
        addCategory(newCategory[0].id)
        refreshCategories()
        setLoading(false)
        handleCloseModal()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseModal = () => {
    setError({ category: false, message: '' })
    setCategory('')
    handleClose()
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '411px',
    height: isMobile ? '350px' : '250px'
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
    <BasicModal style={modalStyle} open={open} handleClose={handleCloseModal}>
      <div>
        <h3 style={titleStyle}>Agregar categoría</h3>
        <div style={rowStyle}>
          <TextField
            value={category}
            fullWidth
            size="small"
            error={error.category}
            label="Categoría"
            inputRef={inputRef}
            onChange={e => setCategory(e.target.value)}
          />
        </div>
        <div style={{ textAlign: 'center', color: theme.palette.error.main, fontSize: '14px' }}>{error.message}</div>
        <div style={actionsStyle}>
          <Button variant="contained" color="primary" onClick={handleAddCategory} disabled={loading}>
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

import { CSSProperties, useState } from 'react'
import BasicModal from './BasicModal'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery
} from '@mui/material'
import { format } from 'path'

export interface AddCategoryBudgetModalProps {
  open: boolean
  handleClose: () => void
}

export default function AddCategoryBudgetModal({ open, handleClose }: AddCategoryBudgetModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [category, setCategory] = useState('shopping')
  const [amount, setAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleAddCategoryBudget = async () => {
    if (!amount || !category) {
      setError(true)
      return
    }
    setError(false)
    setLoading(true)
    // add category budget
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
    width: isMobile ? '80%' : '411px',
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
        <h3 style={titleStyle}>Agregar presupuesto</h3>
        <div style={firstRowStyle}>
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
            >
              <MenuItem value='shopping'>Compras</MenuItem>
              <MenuItem value='food'>Comida</MenuItem>
              <MenuItem value='transport'>Transporte</MenuItem>
              <MenuItem value='services'>Servicios</MenuItem>
              <MenuItem value='entertainment'>Entretenimiento</MenuItem>
              <MenuItem value='health'>Salud</MenuItem>
              <MenuItem value='education'>Educación</MenuItem>
              <MenuItem value='others'>Otros</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ width: isMobile ? '192px' : '115px', margin: '8px' }}
            size="small"
            color="primary"
            label="Cantidad"
            type="number"
            value={amount}
            error={error}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />
        </div>
        <div style={actionsStyle}>
          <Button variant="contained" color="primary" onClick={handleAddCategoryBudget} disabled={loading}>
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

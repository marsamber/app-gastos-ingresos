/* eslint-disable no-unused-vars */
import { SettingsContext } from '@/contexts/SettingsContext'
import { Add } from '@mui/icons-material'
import { Button, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useState } from 'react'
import AddCategoryModal from '../modal/AddCategoryModal'
import DeleteCategoryModal from '../modal/DeleteCategoryModal'
import CategoriesTable from '../table/CategoriesTable'
import BasicCard from './BasicCard'


export default function CategoriesCard() {
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 500px)')
  const [addCategory, setAddCategory] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState(false)
  const [category, setCategory] = useState<string | null>(null)

  const { categories } = useContext(SettingsContext)

  const handleDeleteCategory = (category: string) => {
    const categoryToDelete = categories.find(cat => category === cat)
    setCategory(categoryToDelete!)
    setDeleteCategory(true)
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0',
    width: isMobile ? '60%' : 'unset'
  }

  const cardStyle = {
    width: '100%',
    height: isTablet ? 'auto' : '100%'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  }

  return (
    <BasicCard style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Categorías</h3>
        <Button variant="contained" color="primary" endIcon={<Add />} onClick={() => setAddCategory(true)}>
          Añadir
        </Button>
      </div>
      <div style={containerStyle}>
        <CategoriesTable
          handleDeleteCategory={handleDeleteCategory}
        />
      </div>
      <AddCategoryModal open={addCategory} handleClose={() => setAddCategory(false)} />
      <DeleteCategoryModal
        open={deleteCategory}
        handleClose={() => setDeleteCategory(false)}
        category={category}
      />
    </BasicCard>
  )
}

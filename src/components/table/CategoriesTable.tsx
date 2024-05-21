/* eslint-disable no-unused-vars */
import { SettingsContext } from '@/contexts/SettingsContext'
import { Delete, Edit } from '@mui/icons-material'
import { CircularProgress, IconButton, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import BasicTable from './BasicTable'
import OneCategoryCard from '../card/OneCategoryCard'

interface CategoriesTableProps {
  handleDeleteCategory: (category: string) => void
}

export default function CategoriesTable({ handleDeleteCategory }: CategoriesTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { categories, loadingCategories } = useContext(SettingsContext)
  const [rows, setRows] = useState<any[]>([])

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'actions', label: 'Acciones' }
  ]

  // DATA
  useEffect(() => {
    if (!categories) return
    const rows = categories
      .filter(category => category !== 'Sin categoría')
      .map(category => ({
        id: category,
        category: category,
        actions: (
          <div key={category}>
            {category !== 'Ingresos fijos' && (
              <IconButton onClick={() => handleDeleteCategory(category)}>
                <Delete color="primary" />
              </IconButton>
            )}
          </div>
        )
      }))

    rows.sort((a, b) => a.category.localeCompare(b.category))

    setRows(rows)
  }, [categories])

  // STYLES
  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <>
      {loadingCategories ? (
        <div style={circularProgressStyle}>
          <CircularProgress />
        </div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(row => (
            <OneCategoryCard key={row.id} data={row} />
          ))}{' '}
        </div>
      ) : (
        // <BasicTable headCells={headCells} rows={rows} keyOrder="date" orderDirection="asc" numRowsPerPage={15} />
        <BasicTable headCells={headCells} rows={rows} />
      )}
    </>
  )
}

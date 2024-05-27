/* eslint-disable no-unused-vars */
import { SettingsCategoriesContext } from '@/contexts/SettingsCategoriesContext'
import { Delete } from '@mui/icons-material'
import { IconButton, useMediaQuery } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import OneCategoryCard from '../card/OneCategoryCard'
import BasicTable from './BasicTable'
import { TablePagination } from './TablePagination'

interface CategoriesTableProps {
  handleDeleteCategory: (category: string) => void
}

export default function CategoriesTable({ handleDeleteCategory }: CategoriesTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const containerRef = useRef<HTMLDivElement>(null)
  const { categories, totalItems, page, limit, handleChangeLimit, handleChangePage } =
    useContext(SettingsCategoriesContext)
  const [rows, setRows] = useState<any[]>([])

  const headCells = [
    { id: 'id', label: 'Categoría' },
    { id: 'actions', label: 'Acciones' }
  ]

  // DATA
  useEffect(() => {
    if (!categories) return
    const rows = categories
      .filter(category => category !== 'Sin categoría')
      .map(category => ({
        id: category,
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

    setRows(rows)
  }, [categories])

  return (
    <>
      {isMobile ? (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(row => (
            <OneCategoryCard key={row.id} data={row} />
          ))}
          <TablePagination
            totalItems={totalItems}
            page={page}
            limit={limit}
            handleChangePage={handleChangePage}
            handleChangeLimit={handleChangeLimit}
            containerRef={containerRef}
          />
        </div>
      ) : (
        <BasicTable headCells={headCells} rows={rows} type="settingsCategories" />
      )}
    </>
  )
}

/* eslint-disable no-unused-vars */
import { TablePagination as TablePaginationMui, useMediaQuery } from '@mui/material'
import { ChangeEvent, RefObject } from 'react'

export interface TablePaginationProps {
  totalItems: number
  page: number
  limit: number
  handleChangePage: (page: number) => void
  handleChangeLimit: (limit: number) => void
  containerRef?: RefObject<HTMLDivElement>
}

export const TablePagination = ({
  totalItems,
  page,
  limit,
  handleChangePage,
  handleChangeLimit,
  containerRef
}: TablePaginationProps) => {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleScrollToTop = () => {
    if (!containerRef || !containerRef.current) return

    if (isMobile) {
      const offset = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 50 // Adjust the 50 value according to your nav height
      window.scrollTo({ top: offset, behavior: 'smooth' })
    } else {
      window.scrollTo({ behavior: 'smooth' })
    }
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    handleChangeLimit(parseInt(event.target.value, 10))
    handleChangePage(0)

    if (containerRef && containerRef.current) {
      handleScrollToTop()
    }
  }

  const handleChangePageMui = (event: unknown, newPage: number) => {
    handleChangePage(newPage)

    if (containerRef && containerRef.current) {
      handleScrollToTop()
    }
  }

  return (
    <TablePaginationMui
      rowsPerPageOptions={[5, 10, 15, 20, 25]}
      component="div"
      count={totalItems}
      rowsPerPage={limit}
      page={page}
      onPageChange={handleChangePageMui}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage="Fil/pág"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
    />
  )
}

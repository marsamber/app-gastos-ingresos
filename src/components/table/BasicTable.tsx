/* eslint-disable no-unused-vars */
import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import { ChangeEvent, MouseEvent, useMemo, useState } from 'react'

export interface HeadCell {
  id: string
  label: string
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export interface BasicTableProps {
  headCells: HeadCell[]
  rows: any[]
  numRowsPerPage?: number
  keyOrder?: string
  orderDirection?: Order
}

export default function BasicTable({
  headCells,
  rows,
  numRowsPerPage = 5,
  keyOrder = 'id',
  orderDirection = 'asc'
}: BasicTableProps) {
  const [order, setOrder] = useState<Order>(orderDirection)
  const [orderBy, setOrderBy] = useState<string>(keyOrder)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(numRowsPerPage)

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = useMemo(
    () =>
      rows
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rows, rowsPerPage]
  )

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} headCells={headCells} />
          <TableBody>
            {visibleRows.map(row => {
              return (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {Object.keys(row)
                    .filter(cell => cell != 'id')
                    .map((cell, index) =>
                     typeof row[cell]=== 'number' ? (
                        <TableCell
                          key={index}
                          align="left"
                          style={{
                            color:
                              cell === 'amount' || cell === 'remaining' ? (row[cell] > 0 ? 'green' : 'red') : 'black'
                          }}
                        >
                          {row[cell]} €
                        </TableCell>
                      ) : row[cell] instanceof Date ? (
                        <TableCell key={index} align="left">
                          {row[cell].toLocaleDateString()}
                        </TableCell>
                      ) : (
                        <TableCell key={index} align="left">
                          {row[cell]}
                        </TableCell>
                      )
                    )}
                </TableRow>
              )
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 55 * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void
  order: Order
  orderBy: string
  headCells: HeadCell[]
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, headCells } = props
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id} align="left" sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

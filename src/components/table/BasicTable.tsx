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
import { ChangeEvent, MouseEvent, useMemo, useState, useContext } from 'react'
import { TransactionsContext } from '@/contexts/TransactionsContext'

export interface HeadCell {
  id: string
  label: string
}
export interface BasicTableProps {
  headCells: HeadCell[]
  rows: any[]
}

export default function BasicTable({ headCells, rows }: BasicTableProps) {
  const { page, limit, sortBy, sortOrder, handleChangePage, handleChangeLimit, handleChangeOrder, handleChangeSort, totalItems } =
    useContext(TransactionsContext)

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc'
    handleChangeSort(property)
    handleChangeOrder(isAsc ? 'desc' : 'asc')
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    handleChangeLimit(parseInt(event.target.value, 10))
    handleChangePage(0)
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead order={sortOrder} orderBy={sortBy} onRequestSort={handleRequestSort} headCells={headCells} />
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {Object.keys(row)
                    .filter(cell => cell != 'id')
                    .map((cell, index) =>
                      typeof row[cell] === 'number' ? (
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
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={limit}
        page={page}
        onPageChange={(e, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void
  order: 'asc' | 'desc'
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

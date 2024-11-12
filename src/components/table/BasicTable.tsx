/* eslint-disable no-unused-vars */
import { BudgetsContext } from '@/contexts/BudgetsContext'
import { SettingsBudgetsContext } from '@/contexts/SettingsBudgetsContext'
import { SettingsCategoriesContext } from '@/contexts/SettingsCategoriesContext'
import { SettingsMonthlyExpenseTransactionsContext } from '@/contexts/SettingsMonthlyExpenseTransactionsContext'
import { SettingsMonthlyIncomeTransactionsContext } from '@/contexts/SettingsMonthlyIncomeTransactionsContext'
import { TransactionsContext } from '@/contexts/TransactionsContext'
import { Clear, FilterAlt, Search } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import * as React from 'react'
import { MouseEvent, useContext, useState } from 'react'
import IconButtonWithDropdown from '../IconButtonWithDropdown'
import { TablePagination } from './TablePagination'

export interface HeadCell {
  id: string
  label: string
}
export interface BasicTableProps {
  headCells: HeadCell[]
  rows: any[]
  type:
    | 'transactions'
    | 'budgets'
    | 'settingsBudgets'
    | 'settingsMonthlyIncomeTransactions'
    | 'settingsMonthlyExpenseTransactions'
    | 'settingsCategories'
}

export default function BasicTable({ headCells, rows, type }: BasicTableProps) {
  const transactionsContext = useContext(TransactionsContext)
  const budgetsContext = useContext(BudgetsContext)
  const settingsBudgetsContext = useContext(SettingsBudgetsContext)
  const settingsMonthlyIncomeTransactionsContext = useContext(SettingsMonthlyIncomeTransactionsContext)
  const settingsMonthlyExpenseTransactionsContext = useContext(SettingsMonthlyExpenseTransactionsContext)
  const settingsCategoriesContext = useContext(SettingsCategoriesContext)

  let context: any
  switch (type) {
    case 'transactions':
      context = transactionsContext
      break
    case 'budgets':
      context = budgetsContext
      break
    case 'settingsBudgets':
      context = settingsBudgetsContext
      break
    case 'settingsMonthlyIncomeTransactions':
      context = settingsMonthlyIncomeTransactionsContext
      break
    case 'settingsMonthlyExpenseTransactions':
      context = settingsMonthlyExpenseTransactionsContext
      break
    case 'settingsCategories':
      context = settingsCategoriesContext
      break
    default:
      context = null
  }

  const {
    sortBy,
    sortOrder,
    filters,
    handleChangeSort,
    handleChangeOrder,
    handleChangeFilters,
    ...rest
  } = context;
  
  const {
    totalItems = 0,
    page = 0,
    limit = 10,
    handleChangePage = () => {},
    handleChangeLimit = () => {}
  } = context !== settingsBudgetsContext && context !== settingsCategoriesContext ? rest : {};

  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filters)

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc'
    handleChangeSort(property)
    handleChangeOrder(isAsc ? 'desc' : 'asc')
  }

  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleLocalFilterChange = (filter: string, value: string) => {
    setLocalFilters(prevFilters => ({ ...prevFilters, [filter]: value }))
  }

  const handleApplyFilters = () => {
    handleChangeFilters(localFilters)
  }

  const handleClearFilter = (property: string) => {
    setLocalFilters(prevFilters => ({ ...prevFilters, [property]: '' }))
    handleChangeFilters({ ...filters, [property]: '' })
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }} ref={containerRef}>
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={sortOrder}
            orderBy={sortBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
            filters={localFilters}
            onFilterChange={handleLocalFilterChange}
            onClearFilter={handleClearFilter}
            onApplyFilters={handleApplyFilters}
            setLocalFilters={setLocalFilters}
            getFilters={filters}
          />
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {Object.keys(row)
                    .filter(cell => (type === 'settingsCategories' ? true : cell != 'id'))
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
                      ) : cell === 'actions' ? (
                        <TableCell key={index} align="left">
                          {row[cell]}
                        </TableCell>
                      ) : (
                        <TableCell key={index} align="left" style={{ paddingLeft: 52 }}>
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
      {context !== settingsBudgetsContext && context !== settingsCategoriesContext && <TablePagination
        totalItems={totalItems}
        page={page}
        limit={limit}
        handleChangePage={handleChangePage}
        handleChangeLimit={handleChangeLimit}
        containerRef={containerRef}
      />}
    </Paper>
  )
}

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void
  order: 'asc' | 'desc'
  orderBy: string
  headCells: HeadCell[]
  filters: any
  onFilterChange: (filter: string, value: string) => void
  onClearFilter: (property: string) => void
  onApplyFilters: () => void
  setLocalFilters: any
  getFilters: any
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    order,
    orderBy,
    onRequestSort,
    headCells,
    filters,
    onFilterChange,
    onClearFilter,
    onApplyFilters,
    setLocalFilters,
    getFilters
  } = props
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setLocalFilters(getFilters)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id} align="left" sortDirection={orderBy === headCell.id ? order : false}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {(headCell.id === 'title' ||
                headCell.id === 'category' ||
                headCell.id === 'id') && (
                  <IconButtonWithDropdown
                    icon={<FilterAlt fontSize="small" />}
                    onClick={event => handleClick(event, headCell.id)}
                    options={[
                      <TextField
                        key={headCell.id}
                        label="Filtrar"
                        value={filters[headCell.id] || ''}
                        onChange={event => onFilterChange(headCell.id, event.target.value)}
                        size="small"
                        style={{ width: 200 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="clear filter"
                                onClick={() => onClearFilter(headCell.id)}
                                edge="end"
                              >
                                <Clear fontSize="small" />
                              </IconButton>
                              <IconButton aria-label="apply filter" onClick={() => onApplyFilters()} edge="end">
                                <Search fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    ]}
                  />
                )}
              {headCell.id !== 'actions' &&
              headCell.id !== 'spent' &&
              headCell.id !== 'remaining' &&
              headCell.id !== 'total' ? (
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
              ) : (
                <b>{headCell.label}</b>
              )}
            </div>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

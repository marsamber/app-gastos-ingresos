'use client'
import CategoriesBudgetCard from '@/components/card/CategoriesBudgetCard'
import CategoriesCard from '@/components/card/CategoriesCard'
import FixedTransactionsCard from '@/components/card/FixedTransactionsCard'
import { RefreshContext } from '@/contexts/RefreshContext'
import { SettingsBudgetsContext } from '@/contexts/SettingsBudgetsContext'
import { SettingsCategoriesContext } from '@/contexts/SettingsCategoriesContext'
import { SettingsMonthlyExpenseTransactionsContext } from '@/contexts/SettingsMonthlyExpenseTransactionsContext'
import { SettingsMonthlyIncomeTransactionsContext } from '@/contexts/SettingsMonthlyIncomeTransactionsContext'
import theme from '@/theme'
import { IBudget, IBudgetHistoric, ICategory, IMonthlyTransaction } from '@/types/index'
import customFetch from '@/utils/fetchWrapper'
import { Info } from '@mui/icons-material'
import { Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { CSSProperties, SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react'
import '../../styles.css'

export default function Settings() {
  const {refreshCategories: refreshAllCategories} = useContext(RefreshContext)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1400px)')
  const [monthSelected, setMonthSelected] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [present, setPresent] = useState<boolean>(true)

  const [pageMonthlyIncomeTransactions, setPageMonthlyIncomeTransactions] = useState(0)
  const [limitMonthlyIncomeTransactions, setLimitMonthlyIncomeTransactions] = useState(10)
  const [sortByMonthlyIncomeTransactions, setSortByMonthlyIncomeTransactions] = useState('title')
  const [sortOrderMonthlyIncomeTransactions, setSortOrderMonthlyIncomeTransactions] = useState<'asc' | 'desc'>('asc')
  const [refreshKeyMonthlyIncomeTransactions, setRefreshKeyMonthlyIncomeTransactions] = useState(0)
  const [monthlyIncomeTransactions, setMonthlyIncomeTransactions] = useState<IMonthlyTransaction[] | null>([])
  const [totalItemsMonthlyIncomeTransactions, setTotalItemsMonthlyIncomeTransactions] = useState(0)

  const [pageMonthlyExpenseTransactions, setPageMonthlyExpenseTransactions] = useState(0)
  const [limitMonthlyExpenseTransactions, setLimitMonthlyExpenseTransactions] = useState(10)
  const [sortByMonthlyExpenseTransactions, setSortByMonthlyExpenseTransactions] = useState('title')
  const [sortOrderMonthlyExpenseTransactions, setSortOrderMonthlyExpenseTransactions] = useState<'asc' | 'desc'>('asc')
  const [refreshKeyMonthlyExpenseTransactions, setRefreshKeyMonthlyExpenseTransactions] = useState(0)
  const [monthlyExpenseTransactions, setMonthlyExpenseTransactions] = useState<IMonthlyTransaction[] | null>([])
  const [totalItemsMonthlyExpenseTransactions, setTotalItemsMonthlyExpenseTransactions] = useState(0)

  const [pageCategories, setPageCategories] = useState(0)
  const [limitCategories, setLimitCategories] = useState(15)
  const [sortByCategories, setSortByCategories] = useState('id')
  const [sortOrderCategories, setSortOrderCategories] = useState<'asc' | 'desc'>('asc')
  const [refreshKeyCategories, setRefreshKeyCategories] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [totalItemsCategories, setTotalItemsCategories] = useState(0)
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)

  const [pageBudgets, setPageBudgets] = useState(0)
  const [limitBudgets, setLimitBudgets] = useState(15)
  const [sortByBudgets, setSortByBudgets] = useState('category')
  const [sortOrderBudgets, setSortOrderBudgets] = useState<'asc' | 'desc'>('asc')
  const [refreshKeyBudgets, setRefreshKeyBudgets] = useState(0)
  const [budgets, setBudgets] = useState<IBudget[] | IBudgetHistoric[] | null>([])
  const [totalItemsBudgets, setTotalItemsBudgets] = useState(0)

  const [restingBudget, setRestingBudget] = useState<number>(0)
  const [value, setValue] = useState(0)

  const refreshMonthlyIncomeTransactions = useCallback(
    (newPage: number, newLimit: number, newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setPageMonthlyIncomeTransactions(newPage)
      setLimitMonthlyIncomeTransactions(newLimit)
      setSortByMonthlyIncomeTransactions(newSortBy)
      setSortOrderMonthlyIncomeTransactions(newSortOrder)
      setRefreshKeyMonthlyIncomeTransactions(prev => prev + 1)
    },
    []
  )

  useEffect(() => {
    const fetchMonthlyIncomeTransactions = async () => {
      const response = await customFetch(
        `/api/monthly_transactions?type=income&page=${pageMonthlyIncomeTransactions + 1}&limit=${limitMonthlyIncomeTransactions}&sortBy=${sortByMonthlyIncomeTransactions}&sortOrder=${sortOrderMonthlyIncomeTransactions}`
      )
      if (response.ok) {
        const data = await response.json()
        setMonthlyIncomeTransactions(data.monthlyTransactions)
        setTotalItemsMonthlyIncomeTransactions(data.totalItems)
      }
    }

    fetchMonthlyIncomeTransactions()
  }, [
    refreshKeyMonthlyIncomeTransactions,
    pageMonthlyIncomeTransactions,
    limitMonthlyIncomeTransactions,
    sortByMonthlyIncomeTransactions,
    sortOrderMonthlyIncomeTransactions
  ])

  const refreshMonthlyExpenseTransactions = useCallback(
    (newPage: number, newLimit: number, newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setPageMonthlyExpenseTransactions(newPage)
      setLimitMonthlyExpenseTransactions(newLimit)
      setSortByMonthlyExpenseTransactions(newSortBy)
      setSortOrderMonthlyExpenseTransactions(newSortOrder)
      setRefreshKeyMonthlyExpenseTransactions(prev => prev + 1)
    },
    []
  )

  useEffect(() => {
    const fetchMonthlyExpenseTransactions = async () => {
      const response = await customFetch(
        `/api/monthly_transactions?type=expense&page=${pageMonthlyExpenseTransactions + 1}&limit=${limitMonthlyExpenseTransactions}&sortBy=${sortByMonthlyExpenseTransactions}&sortOrder=${sortOrderMonthlyExpenseTransactions}`
      )
      if (response.ok) {
        const data = await response.json()
        setMonthlyExpenseTransactions(data.monthlyTransactions)
        setTotalItemsMonthlyExpenseTransactions(data.totalItems)
      }
    }

    fetchMonthlyExpenseTransactions()
  }, [
    refreshKeyMonthlyExpenseTransactions,
    pageMonthlyExpenseTransactions,
    limitMonthlyExpenseTransactions,
    sortByMonthlyExpenseTransactions,
    sortOrderMonthlyExpenseTransactions
  ])

  const refreshCategories = useCallback(
    (newPage: number, newLimit: number, newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setPageCategories(newPage)
      setLimitCategories(newLimit)
      setSortByCategories(newSortBy)
      setSortOrderCategories(newSortOrder)
      setRefreshKeyCategories(prev => prev + 1)
    },
    []
  )

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      const response = await customFetch(
        `/api/categories?page=${pageCategories + 1}&limit=${limitCategories}&sortBy=${sortByCategories}&sortOrder=${sortOrderCategories}&excludeCategory=Sin categoría`
      )
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories.map((category: ICategory) => category.id))
        setTotalItemsCategories(data.totalItems)
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [refreshKeyCategories, pageCategories, limitCategories, sortByCategories, sortOrderCategories])

  const refreshBudgets = useCallback(
    (newPage: number, newLimit: number, newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setPageBudgets(newPage)
      setLimitBudgets(newLimit)
      setSortByBudgets(newSortBy)
      setSortOrderBudgets(newSortOrder)
      setRefreshKeyBudgets(prev => prev + 1)
    },
    []
  )

  useEffect(() => {
    const fetchBudgets = async () => {
      const url = present
        ? `/api/budgets?page=${pageBudgets + 1}&limit=${limitBudgets}&sortBy=${sortByBudgets}&sortOrder=${sortOrderBudgets}`
        : `/api/budget_historics?startDate=${monthSelected}&endDate=${dayjs(monthSelected).endOf('month').format('YYYY-MM-DD')}`
      const response = await customFetch(url)
      if (response.ok) {
        const data = await response.json()
        setBudgets(present ? data.budgets : data.budgetHistorics)
        setTotalItemsBudgets(data.totalItems)
      }
    }

    fetchBudgets()
  }, [refreshKeyBudgets, pageBudgets, limitBudgets, sortByBudgets, sortOrderBudgets, monthSelected, present])

  useEffect(() => {
    document.title = 'Configuración - Mis Finanzas'
  }, [])

  // Check if the month selected is the current month
  useEffect(() => {
    const currentDate = new Date().toISOString().substring(0, 7)
    const dateSelected = monthSelected.substring(0, 7)
    setPresent(dateSelected === currentDate)
  }, [monthSelected])

  // Check if the fixed income category exists
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (isFirstLoad) {
      if (loadingCategories || !categories) return

      const fixedIncomeCategory = categories.find(category => category === 'Ingresos fijos')

      if (fixedIncomeCategory) {
        setIsFirstLoad(false)
        setIsCreating(false)
      } else {
        setIsFirstLoad(false)
        setIsCreating(true)
      }
    }
  }, [categories, isFirstLoad])

  // Create fixed income category if it doesn't exist
  useEffect(() => {
    if (!isCreating) return

    customFetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Ingresos fijos' })
    })
      .then(() => {
        return customFetch('/api/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'Ingresos fijos', amount: 0 })
        })
      })
      .then(() => {
        refreshCategories(pageCategories, limitCategories, sortByCategories, sortOrderCategories)
        refreshBudgets(pageBudgets, limitBudgets, sortByBudgets, sortOrderBudgets)
        refreshAllCategories && refreshAllCategories()
      })
      .catch(error => {
        console.error('Failed to create category or budget', error)
      })
      .finally(() => {
        setIsCreating(false)
      })
  }, [isCreating])

  // Handle delete monthly transaction
  const handleDeleteMonthlyTransaction = async (id: number) => {
    const response = await customFetch(`/api/monthly_transactions/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      refreshMonthlyIncomeTransactions(
        pageMonthlyIncomeTransactions,
        limitMonthlyIncomeTransactions,
        sortByMonthlyIncomeTransactions,
        sortOrderMonthlyIncomeTransactions
      )
      refreshMonthlyExpenseTransactions(
        pageMonthlyExpenseTransactions,
        limitMonthlyExpenseTransactions,
        sortByMonthlyExpenseTransactions,
        sortOrderMonthlyExpenseTransactions
      )
    }
  }

  useEffect(() => {
    const totalIncome = monthlyIncomeTransactions?.reduce((acc, transaction) => acc + transaction.amount, 0)
    const totalBudget = budgets
      ?.filter(budget => budget.category !== 'Ingresos fijos')
      .reduce((acc, budget) => acc + budget.amount, 0)


    setRestingBudget(Number(((totalIncome ?? 0) - (totalBudget ?? 0)).toFixed(2)))
  }, [budgets, categories, monthlyIncomeTransactions])

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (newValue === 1) {
      setMonthSelected(dayjs().startOf('month').format('YYYY-MM-DD'))
    }
  }

  // STYLES
  const titleStyle: CSSProperties = {
    margin: '10px 0',
    color: 'black'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: isTablet ? 'column' : 'row',
    gap: '10px',
    width: '100%'
  }

  const columnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: isTablet ? '100%' : '50%',
    height: '100%'
  }

  const budgetStyle: CSSProperties = {
    margin: '10px 0',
    color: theme.palette.primary.main,
    textAlign: 'right',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '5px'
  }

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px'
  }

  return (
    <main className="main">
        <SettingsMonthlyExpenseTransactionsContext.Provider
          value={{
            monthlyTransactions: monthlyExpenseTransactions,
            totalItems: totalItemsMonthlyExpenseTransactions,
            refreshMonthlyTransactions: refreshMonthlyExpenseTransactions,
            refreshKey: refreshKeyMonthlyExpenseTransactions,
            page: pageMonthlyExpenseTransactions,
            limit: limitMonthlyExpenseTransactions,
            sortBy: sortByMonthlyExpenseTransactions,
            sortOrder: sortOrderMonthlyExpenseTransactions,
            handleChangeLimit: (newLimit: number) => setLimitMonthlyExpenseTransactions(newLimit),
            handleChangePage: (newPage: number) => setPageMonthlyExpenseTransactions(newPage),
            handleChangeOrder: (newOrder: 'asc' | 'desc') => setSortOrderMonthlyExpenseTransactions(newOrder),
            handleChangeSort: (newSortBy: string) => setSortByMonthlyExpenseTransactions(newSortBy)
          }}
        >
          <SettingsMonthlyIncomeTransactionsContext.Provider
            value={{
              monthlyTransactions: monthlyIncomeTransactions,
              totalItems: totalItemsMonthlyIncomeTransactions,
              refreshMonthlyTransactions: refreshMonthlyIncomeTransactions,
              refreshKey: refreshKeyMonthlyIncomeTransactions,
              page: pageMonthlyIncomeTransactions,
              limit: limitMonthlyIncomeTransactions,
              sortBy: sortByMonthlyIncomeTransactions,
              sortOrder: sortOrderMonthlyIncomeTransactions,
              handleChangeLimit: (newLimit: number) => setLimitMonthlyIncomeTransactions(newLimit),
              handleChangePage: (newPage: number) => setPageMonthlyIncomeTransactions(newPage),
              handleChangeOrder: (newOrder: 'asc' | 'desc') => setSortOrderMonthlyIncomeTransactions(newOrder),
              handleChangeSort: (newSortBy: string) => setSortByMonthlyIncomeTransactions(newSortBy)
            }}
          >
            <SettingsCategoriesContext.Provider
              value={{
                categories,
                totalItems: totalItemsCategories,
                refreshCategories,
                refreshKey: refreshKeyCategories,
                page: pageCategories,
                limit: limitCategories,
                sortBy: sortByCategories,
                sortOrder: sortOrderCategories,
                handleChangeLimit: (newLimit: number) => setLimitCategories(newLimit),
                handleChangePage: (newPage: number) => setPageCategories(newPage),
                handleChangeOrder: (newOrder: 'asc' | 'desc') => setSortOrderCategories(newOrder),
                handleChangeSort: (newSortBy: string) => setSortByCategories(newSortBy)
              }}
            >
              <SettingsBudgetsContext.Provider
                value={{
                  budgets,
                  totalItems: totalItemsBudgets,
                  refreshBudgets,
                  refreshKey: refreshKeyBudgets,
                  page: pageBudgets,
                  limit: limitBudgets,
                  sortBy: sortByBudgets,
                  sortOrder: sortOrderBudgets,
                  handleChangeLimit: (newLimit: number) => setLimitBudgets(newLimit),
                  handleChangePage: (newPage: number) => setPageBudgets(newPage),
                  handleChangeOrder: (newOrder: 'asc' | 'desc') => setSortOrderBudgets(newOrder),
                  handleChangeSort: (newSortBy: string) => setSortByBudgets(newSortBy),
                  monthSelected
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  {!isMobile && <h2 style={titleStyle}>Configuración</h2>}
                  {present && isMobile ? (
                    <h4 style={budgetStyle}>
                      Presupuesto sin asignar: {restingBudget} €
                      <Tooltip title="Cantidad del presupuesto no asignada a categorías específicas, después de considerar los ingresos fijos y los presupuestos ya asignados a otras categorías.">
                        <Info />
                      </Tooltip>
                    </h4>
                  ) : present && !isMobile ? (
                    <h3 style={budgetStyle}>
                      Presupuesto sin asignar: {restingBudget} €
                      <Tooltip title="Cantidad del presupuesto no asignada a categorías específicas, después de considerar los ingresos fijos y los presupuestos ya asignados a otras categorías.">
                        <Info />
                      </Tooltip>
                    </h3>
                  ) : null}
                </div>
                <div style={tabsStyle}>
                  <Tabs
                    textColor="secondary"
                    indicatorColor="secondary"
                    value={value}
                    onChange={handleChangeTab}
                    variant={isMobile ? 'fullWidth' : 'standard'}
                  >
                    <Tab
                      classes={{
                        selected: 'tabSelected'
                      }}
                      label="Transacciones fijas"
                      value={0}
                    />
                    <Tab
                      classes={{
                        selected: 'tabSelected'
                      }}
                      label="Categorías y presupuestos"
                      value={1}
                    />
                  </Tabs>
                </div>
                {value === 0 && (
                  <div style={containerStyle}>
                    <div style={columnStyle}>
                      <FixedTransactionsCard
                        handleDeleteMonthlyTransaction={handleDeleteMonthlyTransaction}
                        transactionType="income"
                      />
                    </div>
                    <div style={columnStyle}>
                      <FixedTransactionsCard
                        handleDeleteMonthlyTransaction={handleDeleteMonthlyTransaction}
                        transactionType="expense"
                      />
                    </div>
                  </div>
                )}
                {value === 1 && (
                  <div style={containerStyle}>
                    <div style={columnStyle}>
                      <CategoriesCard />
                    </div>
                    <div style={columnStyle}>
                      <CategoriesBudgetCard setMonthSelected={setMonthSelected} />
                    </div>
                  </div>
                )}
              </SettingsBudgetsContext.Provider>
            </SettingsCategoriesContext.Provider>
          </SettingsMonthlyIncomeTransactionsContext.Provider>
        </SettingsMonthlyExpenseTransactionsContext.Provider>
    </main>
  )
}

'use client'
import CategoriesBudgetCard from '@/components/card/CategoriesBudgetCard'
import FixedTransactionsCard from '@/components/card/FixedTransactionsCard'
import { RefreshSettingsContext } from '@/contexts/RefreshSettingsContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import theme from '@/theme'
import { IBudget, IBudgetHistoric, IMonthlyTransaction, IMonthlyTransactions } from '@/types/index'
import { Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { CSSProperties, SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react'
import '../../styles.css'
import { Info } from '@mui/icons-material'
import { RefreshContext } from '@/contexts/RefreshContext'
import useFetch from '@/hooks/useFetch'
import CategoriesCard from '@/components/card/CategoriesCard'
import customFetch from '@/utils/fetchWrapper'

export default function Settings() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1400px)')
  const [monthSelected, setMonthSelected] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [present, setPresent] = useState<boolean>(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingBudgets, setLoadingBudgets] = useState(true)
  const [budgets, setBudgets] = useState<IBudget[]>([])
  const [monthlyTransactions, setMonthlyTransactions] = useState<IMonthlyTransaction[]>([])
  const [restingBudget, setRestingBudget] = useState<number>(0)
  const [value, setValue] = useState(0)

  const { refreshKeyCategories, refreshCategories } = useContext(RefreshContext)

  const [refreshKeyBudgets, setRefreshKeyBudgets] = useState(0)

  const refreshBudgets = useCallback(() => {
    setRefreshKeyBudgets(prev => prev + 1)
  }, [])

  // Refresh data
  const { data, loading: loadingMonthlyTransactions } = useFetch<IMonthlyTransactions>('/api/monthly_transactions')
  useEffect(() => {
    if (data) {
      setMonthlyTransactions(data.monthlyTransactions)
    }
  }, [data])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      const response = await customFetch(`/api/categories`)

      let { categories } = await response.json()
      categories = categories.sort()
      setCategories(categories)
      setLoadingCategories(false)
    }

    fetchCategories()
  }, [refreshKeyCategories])

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoadingBudgets(true)
      let response
      if (present) {
        response = await customFetch(`/api/budgets`)
      } else {
        response = await customFetch(
          `/api/budget_historics?startDate=${monthSelected}&endDate=${dayjs(monthSelected).endOf('month').format('YYYY-MM-DD')}`
        )
      }

      const { budgets } = await response.json()
      setBudgets(budgets)
      setLoadingBudgets(false)
    }

    fetchBudgets()
  }, [refreshKeyBudgets])

  useEffect(() => {
    document.title = 'Configuración - Mis Finanzas'
  }, [])

  // Check if the month selected is the current month
  useEffect(() => {
    const currentDate = new Date().toISOString().substring(0, 7)
    const dateSelected = monthSelected.substring(0, 7)
    setPresent(dateSelected === currentDate)
    refreshBudgets()
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
  }, [loadingCategories, categories, isFirstLoad])

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
        refreshCategories()
        refreshBudgets()
      })
      .catch(error => {
        console.error('Failed to create category or budget', error)
      })
      .finally(() => {
        setIsCreating(false)
      })
  }, [isCreating])

  // Handle delete monthly transaction
  const handleDeleteMonthlyTransaction = (id: number) => {
    customFetch(`/api/monthly_transactions/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setMonthlyTransactions(prev => prev.filter(transaction => transaction.id !== id))
      })
      .catch(error => {
        console.error('Failed to delete transaction', error)
      })
  }

  useEffect(() => {
    if (loadingBudgets || loadingCategories || loadingMonthlyTransactions) return

    const totalBudget = budgets
      .filter(budget => budget.category !== 'Ingresos fijos')
      .reduce((acc, budget) => acc + budget.amount, 0)
    const totalSpent = monthlyTransactions
      .filter(transaction => transaction.category === 'Ingresos fijos')
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    setRestingBudget(-(totalBudget - totalSpent).toFixed(2))
  }, [loadingBudgets, budgets, loadingCategories, categories, loadingMonthlyTransactions, monthlyTransactions])

  const addMonthlyTransaction = (transaction: IMonthlyTransaction) => {
    setMonthlyTransactions(prev => {
      const updatedTransactions = [...prev, transaction]
      return updatedTransactions.sort((a, b) => b.title.localeCompare(a.title))
    })
  }

  const editMonthlyTransaction = (transaction: IMonthlyTransaction) => {
    setMonthlyTransactions(prev => {
      const updatedTransactions = prev.map(t => (t.id === transaction.id ? transaction : t))
      return updatedTransactions.sort((a, b) => b.title.localeCompare(a.title))
    })
  }

  const addBudget = (budget: IBudget | IBudgetHistoric) => {
    setBudgets(prev => {
      const updatedBudgets = [...prev, budget]
      return updatedBudgets.sort((a, b) => b.category.localeCompare(a.category))
    })
  }

  const editBudget = (budget: IBudget | IBudgetHistoric) => {
    setBudgets(prev => {
      const updatedBudgets = prev.map(b => (b.id === budget.id ? budget : b))
      return updatedBudgets.sort((a, b) => b.category.localeCompare(a.category))
    })
  }

  const deleteBudget = (id: number[]) => {
    setBudgets(prev => prev.filter(budget => !id.includes(budget.id)))
  }

  const addCategory = (category: string) => {
    setCategories(prev => {
      const updatedCategories = [...prev, category]
      return updatedCategories.sort()
    })
  }

  const deleteCategory = (category: string) => {
    const transactionsToUpdate = monthlyTransactions.map(transaction => {
      if (transaction.category === category) {
        return { ...transaction, category: 'Sin categoría' }
      }
      return transaction
    })
    setMonthlyTransactions(transactionsToUpdate.sort((a, b) => b.title.localeCompare(a.title)))
  }

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
      <RefreshSettingsContext.Provider
        value={{
          refreshBudgets,
          refreshKeyBudgets
        }}
      >
        <SettingsContext.Provider
          value={{
            loadingBudgets,
            budgets,
            loadingCategories,
            categories,
            loadingMonthlyTransactions,
            monthlyTransactions,
            monthSelected,
            // Functions to add and edit transactions and budgets
            addMonthlyTransaction,
            editMonthlyTransaction,
            addBudget,
            editBudget,
            deleteBudget,
            addCategory,
            deleteCategory
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
              classes={{
                indicator: 'indicator'
              }}
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
        </SettingsContext.Provider>
      </RefreshSettingsContext.Provider>
    </main>
  )
}

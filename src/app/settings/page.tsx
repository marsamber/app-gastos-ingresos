'use client'
import CategoriesCard from '@/components/card/CategoriesCard'
import FixedTransactionsCard from '@/components/card/FixedTransactionsCard'
import { RefreshSettingsContext } from '@/contexts/RefreshSettingsContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import { IBudget, IMonthlyTransaction } from '@/types/index'
import { useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { CSSProperties, useCallback, useEffect, useState } from 'react'
import '../../styles.css'

export default function Settings() {
  const isTablet = useMediaQuery('(max-width: 1400px)')
  const [monthSelected, setMonthSelected] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [present, setPresent] = useState<boolean>(true)
  const [loadingMonthlyTransactions, setLoadingMonthlyTransactions] = useState(true)
  const [monthlyTransactions, setMonthlyTransactions] = useState<IMonthlyTransaction[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingBudgets, setLoadingBudgets] = useState(true)
  const [budgets, setBudgets] = useState<IBudget[]>([])

  const [refreshKeyMonthlyTransactions, setRefreshKeyMonthlyTransactions] = useState(0)
  const [refreshKeyCategories, setRefreshKeyCategories] = useState(0)
  const [refreshKeyBudgets, setRefreshKeyBudgets] = useState(0)

  const refreshMonthlyTransactions = useCallback(() => {
    setRefreshKeyMonthlyTransactions(prev => prev + 1)
  }, [])

  const refreshCategories = useCallback(() => {
    setRefreshKeyCategories(prev => prev + 1)
  }, [])

  const refreshBudgets = useCallback(() => {
    setRefreshKeyBudgets(prev => prev + 1)
  }, [])

  // Refresh data
  useEffect(() => {
    const fetchMonthlyTransactions = async () => {
      setLoadingMonthlyTransactions(true)
      const monthlyTransactions = await fetch(`/api/monthly_transactions`).then(res => res.json())
      setMonthlyTransactions(monthlyTransactions)
      setLoadingMonthlyTransactions(false)
    }

    fetchMonthlyTransactions()
  }, [refreshKeyMonthlyTransactions])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      const categories = await fetch(`/api/categories`).then(res => res.json())
      setCategories(categories)
      setLoadingCategories(false)
    }

    fetchCategories()
  }, [refreshKeyCategories])

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoadingBudgets(true)
      let budgets
      if (present) budgets = await fetch(`/api/budgets`).then(res => res.json())
      else
        budgets = await fetch(
          `/api/budget_historics?startDate=${monthSelected}&endDate=${dayjs(monthSelected).endOf('month').format('YYYY-MM-DD')}`
        ).then(res => res.json())
      setBudgets(budgets)
      setLoadingBudgets(false)
    }

    fetchBudgets()
  }, [refreshKeyBudgets])

  useEffect(() => {
    document.title = 'Configuración - Mis Finanzas'
  }, [])

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

  useEffect(() => {
    if (!isCreating) return

    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Ingresos fijos' })
    })
      .then(() => {
        return fetch('/api/budgets', {
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
    fetch(`/api/monthly_transactions/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        refreshMonthlyTransactions()
      })
      .catch(error => {
        console.error('Failed to delete transaction', error)
      })
  }

  // STYLES
  const titleStyle = {
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

  return (
    <main className="main">
      <RefreshSettingsContext.Provider
        value={{
          refreshBudgets,
          refreshCategories,
          refreshMonthlyTransactions,
          refreshKeyBudgets,
          refreshKeyCategories,
          refreshKeyMonthlyTransactions
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
            <h2 style={titleStyle}>Configuración</h2>
          </div>
          <div style={containerStyle}>
            <div style={columnStyle}>
              <FixedTransactionsCard handleDeleteMonthlyTransaction={handleDeleteMonthlyTransaction} transactionType='income' />
              <FixedTransactionsCard handleDeleteMonthlyTransaction={handleDeleteMonthlyTransaction} transactionType='expense' />
            </div>
            <div style={columnStyle}>
              <CategoriesCard setMonthSelected={setMonthSelected} />
            </div>
          </div>
        </SettingsContext.Provider>
      </RefreshSettingsContext.Provider>
    </main>
  )
}

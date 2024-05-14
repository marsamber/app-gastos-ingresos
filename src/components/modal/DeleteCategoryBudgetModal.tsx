import { RefreshContext } from '@/contexts/RefreshContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import useFetch from '@/hooks/useFetch'
import { IBudget, ITransaction } from '@/types/index'
import { Button, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useState } from 'react'
import BasicModal from './BasicModal'

export interface DeleteCategoryBudgetModalProps {
  open: boolean
  handleClose: () => void
  categoryBudget: IBudget | null
}

export default function DeleteCategoryBudgetModal({
  open,
  handleClose,
  categoryBudget
}: DeleteCategoryBudgetModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { refreshCategories, apiKey } = useContext(RefreshContext)
  const { monthlyTransactions, categories, deleteBudget, deleteCategory } = useContext(SettingsContext)

  const [loading, setLoading] = useState(false)

  const { data: transactions } = useFetch<ITransaction[]>('/api/transactions', {
    headers: {
      'x-api-key': apiKey || ''
    }
  })

  const handleDeleteBudget = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/budgets/${categoryBudget?.id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey || ''
        }
      })

      if (response.status === 401) {
        localStorage.removeItem('apiKey')
        return
      }

      if (response.ok) {
        deleteBudget([categoryBudget?.id!])
        console.log('Budget deleted')
        handleClose()
      }
    } catch (error) {
      console.error(error)
    }

    setLoading(false)

    handleClose()
  }

  const createCategory = async () => {
    const existingCategory = categories.find(category => category === 'Sin categoría')

    if (!existingCategory) {
      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || ''
          },
          body: JSON.stringify({
            category: 'Sin categoría'
          })
        })

        console.log('Category created')
      } catch (error) {
        console.error('Error creating category')
      }
    }
  }

  const updateTransactions = async () => {
    if (!transactions || !categoryBudget) return

    try {
      const transactionsToUpdate = transactions.filter(transaction => transaction.category === categoryBudget.category)
      for (const transaction of transactionsToUpdate) {
        const response = await fetch(`/api/transactions/${transaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || ''
          },
          body: JSON.stringify({
            ...transaction,
            category: 'Sin categoría'
          })
        })

        if (response.ok) {
          console.log('Transaction updated')
        } else {
          console.error('Error updating transaction')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateMonthlyTransactions = async () => {
    if (!monthlyTransactions || !categoryBudget) return

    try {
      const transactionsToUpdate = monthlyTransactions.filter(
        transaction => transaction.category === categoryBudget.category
      )
      for (const transaction of transactionsToUpdate) {
        const response = await fetch(`/api/monthly_transactions/${transaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || ''
          },
          body: JSON.stringify({
            ...transaction,
            category: 'Sin categoría'
          })
        })

        if (response.ok) {
          console.log('Monthly Transaction updated')
        } else {
          console.error('Error updating transaction')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteBudgets = async () => {
    if (!categoryBudget) return

    try {
      await fetch(`/api/budgets`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || ''
        },
        body: JSON.stringify({ category: categoryBudget.category })
      })
      console.log('Budgets deleted')
    } catch (error) {
      console.error('Error deleting budgets')
    }
  }

  const deleteBudgetHistorics = async () => {
    if (!categoryBudget) return

    try {
      await fetch(`/api/budget_historics`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || ''
        },
        body: JSON.stringify({ category: categoryBudget.category })
      })
      console.log('Budget historics deleted')
    } catch (error) {
      console.error('Error deleting budgets historics')
    }
  }

  const deleteCategoryBudget = async () => {
    if (!categoryBudget) return

    try {
      const response = await fetch(`/api/categories/${categoryBudget.category}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey || ''
        }
      })

      if (response.status === 401) {
        localStorage.removeItem('apiKey')
        return
      }

      if (response.ok) {
        deleteBudget([categoryBudget.id!])
        deleteCategory(categoryBudget.category)
        refreshCategories()
        handleClose()
        console.log('Category deleted')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteCategory = async () => {
    setLoading(true)

    try {
      // Create the category if it doesn't exist
      await createCategory()

      // Update transactions only if createCategory succeeds
      await updateTransactions()

      // Update monthly transactions only if updateTransactions succeeds
      await updateMonthlyTransactions()

      // Delete budgets only if updateMonthlyTransactions succeeds
      await deleteBudgets()

      // Delete budget historics only if deleteBudgets succeeds
      await deleteBudgetHistorics()

      // Delete the category budget only if deleteBudgetHistorics succeeds
      await deleteCategoryBudget()
    } catch (error) {
      console.error('An error occurred:', error)
      // Optionally, handle any specific cleanup or recovery from the error here
    } finally {
      setLoading(false)
      handleClose() // Assuming you want to close regardless of success or failure
    }
  }

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '600px',
    height: isMobile ? '550px' : '350px'
  }

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 8px 0px 8px'
  }

  return (
    <BasicModal open={open} style={modalStyle} handleClose={handleClose}>
      <div>
        <h3 style={titleStyle}>Eliminar presupuesto o categoría</h3>
        <p
          style={{
            textAlign: 'justify'
          }}
        >
          Al eliminar el <b>presupuesto</b>, se eliminará únicamente el presupuesto actual y no se incluirá en el mes
          siguiente.
        </p>
        <br />
        <p
          style={{
            textAlign: 'justify'
          }}
        >
          Al eliminar la <b>categoría</b>, se eliminarán todos los presupuestos asociados históricamente.
        </p>
        <div style={actionsStyle}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleDeleteBudget}
            disabled={loading}
            style={{
              fontSize: isMobile ? '12px' : 'auto'
            }}
          >
            Eliminar presupuesto
          </Button>
          <Button
            variant="text"
            color="warning"
            onClick={handleDeleteCategory}
            disabled={loading}
            style={{
              fontSize: isMobile ? '12px' : 'auto'
            }}
          >
            Eliminar categoría &apos;{categoryBudget?.category}&apos;
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}

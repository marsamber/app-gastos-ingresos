import { RefreshContext } from '@/contexts/RefreshContext'
import { SettingsContext } from '@/contexts/SettingsContext'
import useFetch from '@/hooks/useFetch'
import { ITransaction } from '@/types/index'
import { Button, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext, useState } from 'react'
import BasicModal from './BasicModal'

export interface DeleteCategoryModalProps {
  open: boolean
  handleClose: () => void
  category: string | null
}

export default function DeleteCategoryModal({
  open,
  handleClose,
  category
}: DeleteCategoryModalProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { refreshCategories  } = useContext(RefreshContext)
  const { monthlyTransactions, categories, budgets, deleteBudget, deleteCategory } = useContext(SettingsContext)

  const [loading, setLoading] = useState(false)

  const { data: transactions } = useFetch<ITransaction[]>('/api/transactions')

  const createCategory = async () => {
    const existingCategory = categories.find(category => category === 'Sin categoría')

    if (!existingCategory) {
      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
    if (!transactions || !category) return

    try {
      const transactionsToUpdate = transactions.filter(transaction => transaction.category === category)
      for (const transaction of transactionsToUpdate) {
        const response = await fetch(`/api/transactions/${transaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
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
    if (!monthlyTransactions || !category) return

    try {
      const transactionsToUpdate = monthlyTransactions.filter(
        transaction => transaction.category === category
      )
      for (const transaction of transactionsToUpdate) {
        const response = await fetch(`/api/monthly_transactions/${transaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
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
    if (!category) return

    try {
      await fetch(`/api/budgets`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category })
      })
      console.log('Budgets deleted')
    } catch (error) {
      console.error('Error deleting budgets')
    }
  }

  const deleteBudgetHistorics = async () => {
    if (!category) return

    try {
      await fetch(`/api/budget_historics`, { method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category })
       })
      console.log('Budget historics deleted')
    } catch (error) {
      console.error('Error deleting budgets historics')
    }
  }

  const deleteCategorySelected = async () => {
    if (!category) return

    try {
      const response = await fetch(`/api/categories/${category}`, { method: 'DELETE' })

      if (response.ok) {
        const budgetsId = budgets.filter(budget => budget.category === category).map(budget => budget.id)
        deleteBudget(budgetsId)
        deleteCategory(category)
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
      await createCategory();
  
      // Update transactions only if createCategory succeeds
      await updateTransactions();
  
      // Update monthly transactions only if updateTransactions succeeds
      await updateMonthlyTransactions();
  
      // Delete budgets only if updateMonthlyTransactions succeeds
      await deleteBudgets();
  
      // Delete budget historics only if deleteBudgets succeeds
      await deleteBudgetHistorics();
  
      // Delete the category budget only if deleteBudgetHistorics succeeds
      await deleteCategorySelected();
  
    } catch (error) {
      console.error('An error occurred:', error);
      // Optionally, handle any specific cleanup or recovery from the error here
    } finally {
      setLoading(false);
      handleClose(); // Assuming you want to close regardless of success or failure
    }
  };

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const modalStyle: CSSProperties = {
    width: isMobile ? '80%' : '600px',
    height: isMobile ? '300px' : '250px'
  }

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 8px 0px 8px'
  }

  return (
    <BasicModal open={open} style={modalStyle} handleClose={handleClose}>
      <div>
        <h3 style={titleStyle}>Eliminar categoría</h3>
        <p
          style={{
            textAlign: 'justify'
          }}
        >
          Al eliminar la <b>categoría</b>, se eliminarán todos los presupuestos asociados históricamente.
        </p>
        <div style={actionsStyle}>
          <Button
            variant="text"
            color="warning"
            onClick={handleDeleteCategory}
            disabled={loading}
            style={{
              fontSize: isMobile ? '12px' : 'auto'
            }}
          >
            Eliminar categoría &apos;{category}&apos;
          </Button>
        </div>
      </div>
    </BasicModal>
  )
}

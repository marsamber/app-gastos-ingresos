import { CircularProgress, useMediaQuery } from '@mui/material';
import BasicTable from './BasicTable';
import OneCategoryCard from '../card/OneCategoryCard';
import { CSSProperties, useContext, useEffect, useState } from 'react';
import { HomeContext } from '@/contexts/HomeContext';

interface BudgetTableProps {
  includeHistorics?: boolean; // Determina si incluir o no datos históricos
}

interface BudgetTableData {
  id: string;
  category: string;
  spent: number;
  remaining: number;
  total: number;
}

export default function BudgetTable({ includeHistorics = false }: BudgetTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const { transactions, loadingTransactions, budgets, loadingBudgets, budgetHistorics, loadingBudgetHistorics } = useContext(HomeContext);
  const [rows, setRows] = useState<BudgetTableData[]>([]);

  const headCells = [
    { id: 'category', label: 'Categoría' },
    { id: 'spent', label: 'Gastado' },
    { id: 'remaining', label: 'Restante' },
    { id: 'total', label: 'Total' }
  ];

  useEffect(() => {
    let data: BudgetTableData[] = [];

    // Lógica común para presupuestos
    if (budgets) {
      budgets.filter(budget => budget.category !== 'Ingresos fijos').forEach(budget => {
        data.push({
          id: budget.category,
          category: budget.category,
          spent: 0,
          remaining: budget.amount,
          total: budget.amount
        });
      });
    }

    // Lógica específica para históricos
    if (includeHistorics && budgetHistorics) {
      budgetHistorics.filter(budget => budget.category !== 'Ingresos fijos').forEach(historic => {
        const index = data.findIndex(d => d.id === historic.category);
        if (index !== -1) {
          data[index].remaining += historic.amount;
          data[index].total += historic.amount;
        } else {
          data.push({
            id: historic.category,
            category: historic.category,
            spent: 0,
            remaining: historic.amount,
            total: historic.amount
          });
        }
      });
    }

    // Lógica común para transacciones
    if (transactions) {
      transactions.filter(budget => budget.category !== 'Ingresos fijos').forEach(transaction => {
        const index = data.findIndex(d => d.id === transaction.category);
        if (index !== -1) {
          data[index].spent -= transaction.amount;
          data[index].remaining += transaction.amount;
        }
      });
    }

    setRows(data);
  }, [transactions, budgets, budgetHistorics, includeHistorics]);

  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };

  return (
    <>
      {(loadingTransactions || loadingBudgets || (includeHistorics && loadingBudgetHistorics)) && (
        <CircularProgress style={circularProgressStyle} />
      )}
      {!isMobile && !loadingTransactions && transactions && !loadingBudgets && budgets && (!includeHistorics || budgetHistorics) && (
        <BasicTable headCells={headCells} rows={rows} keyOrder="category" numRowsPerPage={10} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isMobile &&
          !loadingTransactions &&
          transactions &&
          !loadingBudgets &&
          budgets &&
          (!includeHistorics || budgetHistorics) &&
          rows.sort((a, b) => (a.category > b.category ? 1 : -1)).map(row => <OneCategoryCard key={row.id} data={row} />)}
      </div>
    </>
  );
}
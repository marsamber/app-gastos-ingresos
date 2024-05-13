/* eslint-disable no-unused-vars */
import { ITransaction } from '@/types/index';
import { createContext } from 'react';

interface TransactionsContextType {
  transactions: ITransaction[] | null;
  loadingTransactions: boolean;
  addTransaction: (transaction: ITransaction) => void;
  editTransaction: (transaction: ITransaction) => void;
}

const defaultValue: TransactionsContextType = {
  transactions: null,
  loadingTransactions: true,
  addTransaction: () => {},
  editTransaction: () => {}
};

export const TransactionsContext = createContext<TransactionsContextType>(defaultValue);

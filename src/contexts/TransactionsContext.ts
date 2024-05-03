import { ITransaction } from '@/types/index';
import { createContext } from 'react';

interface TransactionsContextType {
  transactions: ITransaction[] | null;
  loadingTransactions: boolean;
}

const defaultValue: TransactionsContextType = {
  transactions: null,
  loadingTransactions: true,
};

export const TransactionsContext = createContext<TransactionsContextType>(defaultValue);

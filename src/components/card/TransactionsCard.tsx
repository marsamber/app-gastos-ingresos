import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { useMediaQuery } from '@mui/material'
import useFetch from '@/hooks/useFetch'
import { ITransaction } from '@/types/index'

export default function TransactionsCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  // MOCK DATA

  const { data, error, loading } = useFetch<ITransaction[]>('/api/transactions')

  // STYLES
  const titleStyle = {
    margin: '10px 0'
  }

  const cardStyle = {
    width: isMobile ? '100%' : '30%',
    height: isTablet ? '500px' : '450px'
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    height: isTablet ? '400px' : '350px'
  }

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Transacciones recientes</h3>
      <div style={containerStyle}>
        {loading && <p>Cargando...</p>}
        {!loading &&
          data &&
          data.slice(0, 5).map((transaction, index) => (
            <>
              <Transaction key={transaction.id} transaction={{ ...transaction, date: new Date(transaction.date) }} />
              {index !== data.slice(0, 5).length - 1 && <hr />}
            </>
          ))}
      </div>
    </BasicCard>
  )
}

function Transaction({ transaction }: { transaction: { id: number; title: string; amount: number; date: Date } }) {
  //STYLES
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'center'
  }

  const descriptionStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  }

  const titleStyle = {
    fontSize: '15px'
  }

  const dateStyle: CSSProperties = {
    fontSize: '14px'
  }

  const amountStyle: CSSProperties = {
    color: transaction.amount > 0 ? 'green' : 'red',
    fontSize: '15px'
  }

  return (
    <div style={containerStyle}>
      <div style={descriptionStyle}>
        <p style={titleStyle}>{transaction.title}</p>
        <span style={dateStyle}>{transaction.date.toLocaleDateString()}</span>
      </div>
      <p style={amountStyle}>{transaction.amount} €</p>
    </div>
  )
}

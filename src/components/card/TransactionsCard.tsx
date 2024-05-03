import { HomeContext } from '@/contexts/HomeContext'
import { CircularProgress, useMediaQuery } from '@mui/material'
import { CSSProperties, useContext } from 'react'
import BasicCard from './BasicCard'

export default function TransactionsCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const { loadingTransactions, transactions } = useContext(HomeContext)

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

  const circularProgressStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }

  return (
    <BasicCard style={cardStyle}>
      <h3 style={titleStyle}>Transacciones recientes</h3>
      {loadingTransactions && (
        <div style={circularProgressStyle}>
          <CircularProgress />
        </div>
      )}
      <div style={containerStyle}>
        {!loadingTransactions && transactions && transactions.length == 0 ? (
          <p>No hay datos para mostrar</p>
        ) : (
          transactions &&
          transactions.slice(0, 5).map((transaction, index) => (
            <>
              <Transaction key={transaction.id} transaction={{ ...transaction, date: new Date(transaction.date) }} />
              {index !== transactions.slice(0, 5).length - 1 && <hr />}
            </>
          ))
        )}
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
    gap: '5px',
    maxWidth: '70%'
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

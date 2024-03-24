import { CSSProperties } from 'react'
import BasicCard from './BasicCard'
import { useMediaQuery } from '@mui/material'

export default function TransactionsCard() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  // MOCK DATA
  const transactions = [
    {
      id: 1,
      title: 'Compra de supermercado',
      amount: -100,
      date: new Date()
    },
    {
      id: 2,
      title: 'Pago de factura',
      amount: -50,
      date: new Date()
    },
    {
      id: 3,
      title: 'Retiro de efectivo',
      amount: -200,
      date: new Date()
    },
    {
      id: 4,
      title: 'Pago de deuda',
      amount: -150,
      date: new Date()
    },
    {
      id: 5,
      title: 'Pago de alquiler de apartamento',
      amount: -800,
      date: new Date()
    },
    {
      id: 6,
      title: 'Ingreso de salario',
      amount: 1000,
      date: new Date()
    }
  ]

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
        {transactions.slice(0, 5).map((transaction, index) => (
          <>
            <Transaction transaction={transaction} />
            {index !== 5 - 1 && <hr />}
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

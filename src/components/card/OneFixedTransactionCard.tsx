import { ReactNode } from 'react'
import BasicCard from './BasicCard'

export interface OneFixedTransactionCardProps {
  data: {
    id: number
    title: string
    amount: number
    actions: ReactNode
  }
}

export default function OneFixedTransactionCard({ data }: OneFixedTransactionCardProps) {
  // STYLES
  const titleStyle = {
    fontSize: '14px'
  }

  const dataStyle = {
    fontSize: '14px',
    padding: '0 10px'
  }

  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  return (
    <BasicCard>
      <p>
        <b>{data.title}</b>
      </p>
      <div style={contentStyle}>
        <div>
          <b style={titleStyle}>Cantidad</b>
          <p
            style={{
              ...dataStyle,
              color: data.amount > 0 ? 'green' : 'red'
            }}
          >
            {data.amount} €
          </p>
        </div>
        {data.actions}
      </div>
    </BasicCard>
  )
}

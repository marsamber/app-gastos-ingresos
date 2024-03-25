import BasicCard from './BasicCard'

export interface OneFixedTransactionCardProps {
  data: {
    id: number
    description: string
    amount: number
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

  return (
    <BasicCard>
      <p>
        <b>{data.description}</b>
      </p>
      <b style={titleStyle}>Cantidad</b>
      <p
        style={{
          ...dataStyle,
          color: data.amount > 0 ? 'green' : 'red'
        }}
      >
        {data.amount} €
      </p>
    </BasicCard>
  )
}

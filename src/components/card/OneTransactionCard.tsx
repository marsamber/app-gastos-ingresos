import BasicCard from './BasicCard'

export interface OneTransactionCardProps {
  data: {
    id: number
    title: string
    category: string
    date: Date
    amount: number,
    actions: JSX.Element
  }
}

export default function OneTransactionCard({ data }: OneTransactionCardProps) {
  // STYLES
  const titleStyle = {
    fontSize: '14px',
  }
  
  const dataStyle = {
    fontSize: '14px',
    padding: '0 10px'
  }

  return (
    <BasicCard>
      <p><b>{data.title}</b></p>
      <p style={dataStyle}>{data.category}</p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: '10px'
        }}
      >
        <b style={titleStyle}>Fecha</b>
        <b style={titleStyle}>Cantidad</b>
        <b style={{...titleStyle, color: 'white'}}>Acciones</b>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <p style={dataStyle}>{data.date.toLocaleDateString()}</p>
        <p
          style={{
            ...dataStyle,
            color: data.amount > 0 ? 'green' : 'red'
          }}
        >
          {data.amount} €
        </p>
        {data.actions}
      </div>
    </BasicCard>
  )
}

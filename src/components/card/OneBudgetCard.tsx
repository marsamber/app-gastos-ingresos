import BasicCard from './BasicCard'

export interface OneBudgetCardProps {
  data: {
    id: string
    category: string
    spent: number
    remaining: number
    total: number
  }
}

export default function OneBudgetCard({ data }: OneBudgetCardProps) {
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
      <b>{data.category}</b>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <b style={titleStyle}>Gastado</b>
        <b style={titleStyle}>Restante</b>
        <b style={titleStyle}>Total</b>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <p style={dataStyle}>{data.spent} €</p>
        <p style={dataStyle}>{data.remaining} €</p>
        <p
          style={{
            ...dataStyle,
            color: data.total > 0 ? 'green' : 'red'
          }}
        >
          {data.total} €
        </p>
      </div>
    </BasicCard>
  )
}

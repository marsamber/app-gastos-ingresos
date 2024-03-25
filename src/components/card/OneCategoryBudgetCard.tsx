import BasicCard from './BasicCard'

export interface OneCategoryBudgetCardProps {
  data: {
    id: number
    description: string
    budget: number
  }
}

export default function OneCategoryBudgetCard({ data }: OneCategoryBudgetCardProps) {
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
      <b style={titleStyle}>Presupuesto</b>
      <p>{data.budget} €</p>
    </BasicCard>
  )
}

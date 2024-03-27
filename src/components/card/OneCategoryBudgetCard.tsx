import { ReactNode } from 'react'
import BasicCard from './BasicCard'

export interface OneCategoryBudgetCardProps {
  data: {
    id: number
    description: string
    budget: number
    actions: ReactNode
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

  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  return (
    <BasicCard>
      <p>
        <b>{data.description}</b>
      </p>
      <div style={contentStyle}>
        <div>
          <b style={titleStyle}>Presupuesto</b>
          <p style={dataStyle}>{data.budget} €</p>
        </div>
        {data.actions}
      </div>
    </BasicCard>
  )
}

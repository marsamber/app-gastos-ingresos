import { ReactNode } from 'react'
import BasicCard from './BasicCard'

export interface OneCategoryCardProps {
  data: {
    id: number
    category: string
    actions: ReactNode
  }
}

export default function OneCategoryCard({ data }: OneCategoryCardProps) {
  // STYLES
  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  return (
    <BasicCard>
      <div style={contentStyle}>
        <b>{data.category}</b>
        {data.actions}
      </div>
    </BasicCard>
  )
}

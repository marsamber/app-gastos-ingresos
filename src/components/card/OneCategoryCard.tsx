import { ReactNode } from 'react'
import BasicCard from './BasicCard'

export interface OneCategoryCardProps {
  data: {
    id: string
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
        <b>{data.id}</b>
        {data.actions}
      </div>
    </BasicCard>
  )
}

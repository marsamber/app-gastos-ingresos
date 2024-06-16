import { Document } from '@react-pdf/renderer'
import ItemsTable from './ItemsTable'

interface TableProps {
  data: {
    headers: string[]
    items: Array<{
      sr: number
      month: string
      income: number
      expense: number
      balance: number
    }>
  }
}

const Table = ({ data }: TableProps) => (
    <Document>
      <ItemsTable data={data} />
    </Document>
  )

export default Table

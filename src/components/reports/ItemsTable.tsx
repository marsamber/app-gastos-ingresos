import React from 'react'
import { View, StyleSheet } from '@react-pdf/renderer'
import TableRow from './TableRow'
import TableHeader from './TableHeader'

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
  }
})

interface ItemsTableProps {
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

const ItemsTable = ({ data }: ItemsTableProps) => (
  <View style={styles.tableContainer}>
    <TableHeader headers={data.headers} />
    <TableRow items={data.items} />
  </View>
)

export default ItemsTable

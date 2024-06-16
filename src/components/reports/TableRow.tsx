import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { Fragment } from 'react'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  month: {
    width: '25%',
    textAlign: 'center'
  },
  income: {
    width: '25%',
    textAlign: 'center'
  },
  expense: {
    width: '25%',
    textAlign: 'center'
  },
  balance: {
    width: '25%',
    textAlign: 'center'
  }
})

interface TableRowProps {
  items: Array<{
    sr: number
    month: string
    income: number
    expense: number
    balance: number
  }>
}

const TableRow = ({ items }: TableRowProps) => {
  const rows = items.map(item => (
    <View style={styles.row} key={item.sr.toString()}>
      <Text style={styles.month}>{item.month}</Text>
      <Text style={styles.income}>{item.income} €</Text>
      <Text style={styles.expense}>{item.expense} €</Text>
      <Text style={styles.balance}>{item.balance} €</Text>
    </View>
  ))
  return <Fragment>{rows}</Fragment>
}

export default TableRow

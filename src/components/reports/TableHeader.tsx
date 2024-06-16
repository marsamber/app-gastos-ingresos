import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  headerCell: {
    width: '25%',
    textAlign: 'center'
  }
})

interface TableHeaderProps {
  headers: string[]
}

const TableHeader = ({ headers }: TableHeaderProps) => (
  <View style={styles.tableHeader}>
    {headers.map(header => (
      <Text style={styles.headerCell} key={header}>
        {header}
      </Text>
    ))}
  </View>
)

export default TableHeader

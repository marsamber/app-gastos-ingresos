/* eslint-disable jsx-a11y/alt-text */
import { TableReportData } from '@/types/index'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import Table from './Table'
import { getTwoFirstDecimals } from '@/utils/utils'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontSize: 10,
    padding: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  parameter: {
    fontSize: 12,
    marginBottom: 10
  },
  charts: {
    // width: '100%'
  }
})

interface IncomeExpenseReportProps {
  monthsSelected: [string, string]
  firstLineChartSrc: string
  secondLineChartSrc: string
  barChartSrc: string
  totalIncome: number
  totalExpense: number
  percentageChangeIncome: number
  percentageChangeExpense: number
  percentageChangeBalance: number
  tableData: TableReportData | null
}

const IncomeExpenseReport = ({
  monthsSelected,
  firstLineChartSrc,
  secondLineChartSrc,
  barChartSrc,
  totalIncome,
  totalExpense,
  percentageChangeIncome,
  percentageChangeExpense,
  percentageChangeBalance,
  tableData
}: IncomeExpenseReportProps) => {
  const monthsNameSelected = monthsSelected.map(date => {
    const [year, month, day] = date.split('T')[0].split('-')
    const dateUTC = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
    return dateUTC.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  })

  if (monthsNameSelected[0] === monthsNameSelected[1]) {
    monthsNameSelected[1] = ''
  } else {
    monthsNameSelected[1] = ` - ${monthsNameSelected[1]}`
  }

  const previousMonth = new Date(monthsSelected[0])
  previousMonth.setMonth(previousMonth.getMonth() - 1)
  const previousMonthName = previousMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Informe de tendencias de ingresos y gastos ({monthsNameSelected[0]}
          {monthsNameSelected[1]})
        </Text>
        <View
          style={{
            marginBottom: 10
          }}
        >
          <Text style={styles.parameter}>
            Resumen {monthsNameSelected[1] !== '' ? '' : `(con respecto a ${previousMonthName})`}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Ingresos totales:</Text>
            <Text>
              {totalIncome} € {monthsNameSelected[1] !== '' ? '' : `(${percentageChangeIncome}%)`}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Gastos totales:</Text>
            <Text>
              {totalExpense} € {monthsNameSelected[1] !== '' ? '' : `(${percentageChangeExpense}%)`}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Ahorro neto:</Text>
            <Text>
              {getTwoFirstDecimals(totalIncome - totalExpense)} € {monthsNameSelected[1] !== '' ? '' : `(${percentageChangeBalance}%)`}
            </Text>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10
          }}
        >
          <View style={styles.charts}>
            <Text style={styles.parameter}>
              Tendencia de ingresos y gastos por {monthsNameSelected[1] === '' ? 'día' : 'semana'}
            </Text>
            <Image src={firstLineChartSrc} />
          </View>

          <View style={styles.charts}>
            <Text style={styles.parameter}>
              Tendencia de ingresos y gastos por {monthsNameSelected[1] === '' ? 'semana' : 'mes'}
            </Text>
            <Image src={secondLineChartSrc} />
          </View>
        </View>

        <View style={styles.charts}>
          <Text style={styles.parameter}>Desglose de ingresos y gastos por categoría</Text>
          <Image src={barChartSrc} />
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.parameter}>Comparación de ingresos y gastos por período de tiempo</Text>
          {tableData && <Table data={tableData} />}
        </View>

        {monthsNameSelected[1] === '' && (
          <View>
            <Text style={styles.parameter}>Análisis</Text>
            <View>
              <Text>
                Sus ingresos{' '}
                {percentageChangeIncome > 0
                  ? 'aumentaron'
                  : percentageChangeIncome < 0
                    ? 'disminuyeron'
                    : 'se mantuvieron'}{' '}
                {percentageChangeIncome == 0 ? '' : `un ${percentageChangeIncome}%`} en {monthsNameSelected[0]}, lo cual
                es una tendencia{' '}
                {percentageChangeIncome > 0 ? 'positiva' : percentageChangeIncome < 0 ? 'negativa' : 'neutral'}.
              </Text>
            </View>
            <View>
              <Text>
                Sus gastos {percentageChangeIncome > 0 && percentageChangeExpense > 0 ? 'también' : ''}{' '}
                {percentageChangeExpense > 0
                  ? 'aumentaron'
                  : percentageChangeExpense < 0
                    ? 'disminuyeron'
                    : 'se mantuvieron'}{' '}
                {percentageChangeExpense == 0 ? '' : `un ${percentageChangeExpense}%`} en {monthsNameSelected[0]},{' '}
                {percentageChangeExpense > 0
                  ? 'por lo que es importante vigilarlos de cerca'
                  : percentageChangeExpense < 0
                    ? 'lo cual está muy bien'
                    : 'por lo que no ha habido variación'}
                .
              </Text>
            </View>
            <View>
              <Text>
                Su ahorro neto en {monthsNameSelected[0]} fue de {totalIncome - totalExpense}€, lo cual es{' '}
                {totalIncome - totalExpense < 0 ? 'mejorable' : 'un buen resultado'}.
              </Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}

export default IncomeExpenseReport

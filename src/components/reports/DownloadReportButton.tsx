import { HomeContext } from '@/contexts/HomeContext'
import useFetch from '@/hooks/useFetch'
import { ICategories, IMonthlyTransactions, ITransactions, TableReportData } from '@/types/index'
import { formatDate, formatMonthYear, getDateWeekOfMonth, getTwoFirstDecimals, monthNames } from '@/utils/utils'
import { Download, PictureAsPdf } from '@mui/icons-material'
import { CircularProgress, Fab } from '@mui/material'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useContext, useEffect, useState } from 'react'
import BarChart from './BarChart'
import IncomeExpenseReport from './IncomeExpenseReport'
import LineChart from './LineChart'

const DownloadReportButton = () => {
  const [isClient, setIsClient] = useState(false)
  const [generateReport, setGenerateReport] = useState(false)
  // const [progress, setProgress] = useState(0)
  const [previousMonth, setPreviousMonth] = useState<[string, string]>(['', ''])

  const { transactions, monthsSelected } = useContext(HomeContext)
  const { data: categoriesData } = useFetch<ICategories>('/api/categories')
  const { data: monthlyTransactionsData } = useFetch<IMonthlyTransactions>('api/monthly_transactions')
  const { data: transactionsSincePreviousMonthData } = useFetch<ITransactions>(
    `/api/transactions?startDate=${previousMonth[0]}&endDate=${monthsSelected[1]}`
  )

  const [totalIncome, setTotalIncome] = useState<number>(0)
  const [totalIncomePreviousMonth, setTotalIncomePreviousMonth] = useState<number>(0)
  const [percentageChangeIncome, setPercentageChangeIncome] = useState<number>(0)
  const [totalExpense, setTotalExpense] = useState<number>(0)
  const [totalExpensePreviousMonth, setTotalExpensePreviousMonth] = useState<number>(0)
  const [percentageChangeExpense, setPercentageChangeExpense] = useState<number>(0)
  const [percentageChangeBalance, setPercentageChangeBalance] = useState<number>(0)

  const [firstLineChartData, setFirstLineChartData] = useState<any[]>([])
  const [secondLineChartData, setSecondLineChartData] = useState<any[]>([])
  const [firstLineChartSrc, setFirstChartSrc] = useState<string | null>(null)
  const [secondLineChartSrc, setSecondLineChartSrc] = useState<string | null>(null)
  const [barChartData, setBarChartData] = useState<any[]>([])
  const [barChartSrc, setBarChartSrc] = useState<string | null>(null)

  const [tableData, setTableData] = useState<TableReportData | null>(null)

  const imgSrc = 'https://t3.ftcdn.net/jpg/04/60/01/36/360_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg'

  useEffect(() => {
    setIsClient(true)
  }, [])

  // useEffect(() => {
  //   const totalTimeout = 8000 // Total time including timeouts for all components
  //   const startTime = Date.now()

  //   const updateProgress = () => {
  //     const elapsedTime = Date.now() - startTime
  //     const newProgress = (elapsedTime / totalTimeout) * 100
  //     setProgress(Math.min(newProgress, 100))
  //   }

  //   const progressInterval = setInterval(updateProgress, 100)

  //   // Cleanup
  //   return () => clearInterval(progressInterval)
  // }, [monthsSelected])

  // Retrieve data for the charts
  const getDailyData = () => {
    const dataMap = new Map()
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const date = new Date(transaction.date)
        const dayKey = date.toISOString().split('T')[0] // Formato YYYY-MM-DD
        const dateString = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: '2-digit'
        })
        const existingEntry = dataMap.get(dayKey)
        if (existingEntry) {
          existingEntry.Gastado = getTwoFirstDecimals(existingEntry.Gastado - transaction.amount)
        } else {
          dataMap.set(dayKey, { name: dateString, Gastado: getTwoFirstDecimals(-transaction.amount) })
        }
      })

    // Asegurar que todos los días entre las fechas seleccionadas están representados
    const [startDate, endDate]: Date[] = monthsSelected.map(date => new Date(date))
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayKey = currentDate.toISOString().split('T')[0]
      const dateString = currentDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      if (!dataMap.has(dayKey)) {
        dataMap.set(dayKey, { name: dateString, Gastado: 0 })
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return Array.from(dataMap.values()).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
  }

  const getWeeklyData = () => {
    const dataMap = new Map()
    const months: string[] = []
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const [year, month, day] = transaction.date
          .toLocaleString()
          .split('T')[0]
          .split('-')
          .map(date => parseInt(date))
        const monthYear = formatMonthYear(year, month - 1, day, 0, 0)
        if (!months.includes(monthYear)) {
          months.push(monthYear)
        }
        const week = getDateWeekOfMonth(new Date(transaction.date))
        const key = `${week} (${monthYear})`
        const existingEntry = dataMap.get(key)
        if (existingEntry) {
          existingEntry.Gastado = getTwoFirstDecimals(existingEntry.Gastado - transaction.amount)
        } else {
          dataMap.set(key, { name: `Sem. ${week} (${monthYear})`, Gastado: getTwoFirstDecimals(-transaction.amount) })
        }
      })

    // Ensure all weeks are represented in the data
    for (let i = 1; i <= 5; i++) {
      for (const month of months) {
        const key = `${i} (${month})`
        if (!dataMap.has(key)) {
          dataMap.set(key, { name: `Sem. ${i} (${month})`, Gastado: 0 })
        }
      }
    }

    // key format: 'Sem. 1 (Ene 21)'
    return Array.from(dataMap.values()).sort((a, b) => {
      const aMonth = a.name.split('(')[1].substring(0, a.name.split('(')[1].length - 4)
      const bMonth = b.name.split('(')[1].substring(0, b.name.split('(')[1].length - 4)
      const aYear = a.name.split('(')[1].substring(a.name.split('(')[1].length - 3, a.name.split('(')[1].length - 1)
      const bYear = b.name.split('(')[1].substring(b.name.split('(')[1].length - 3, b.name.split('(')[1].length - 1)

      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear)
      } else if (monthNames.indexOf(aMonth) !== monthNames.indexOf(bMonth)) {
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
      } else {
        const aWeek = parseInt(a.name.split(' ')[1])
        const bWeek = parseInt(b.name.split(' ')[1])
        return aWeek - bWeek
      }
    })
  }

  const getMonthlyData = () => {
    const dataMap = new Map()

    // Add the months with no transactions
    const startDate = monthsSelected[0].split('-')
    const startDateUTC = new Date(Date.UTC(parseInt(startDate[0]), parseInt(startDate[1]) - 1, parseInt(startDate[2])))
    const endDate = monthsSelected[1].split('-')
    const endDateUTC = new Date(Date.UTC(parseInt(endDate[0]), parseInt(endDate[1]) - 1, parseInt(endDate[2])))

    const currentDate = startDateUTC
    while (currentDate <= endDateUTC) {
      const key = formatMonthYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0)
      if (!dataMap.has(key)) {
        dataMap.set(key, { name: key, Gastado: 0 })
      }
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos')
      .forEach(transaction => {
        const [year, month, day] = transaction.date
          .toLocaleString()
          .split('T')[0]
          .split('-')
          .map(date => parseInt(date))
        const key = formatMonthYear(year, month - 1, day, 0, 0)
        const existingEntry = dataMap.get(key)
        if (existingEntry) {
          existingEntry.Gastado = getTwoFirstDecimals(existingEntry.Gastado - transaction.amount)
        }
      })

    // key format: 'Ene 21'
    return Array.from(dataMap.values()).sort((a, b) => {
      const aMonth = a.name.split(' ')[0]
      const bMonth = b.name.split(' ')[0]
      const aYear = a.name.split(' ')[1]
      const bYear = b.name.split(' ')[1]

      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear)
      } else {
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
      }
    })
  }

  const getTransactionsByCategory = () => {
    const categories = categoriesData?.categories

    const dataMap = new Map()
    transactions
      ?.filter(transaction => transaction.category !== 'Ingresos fijos' && transaction.category !== 'Sin categoría')
      .forEach(transaction => {
        const existingEntry = dataMap.get(transaction.category)
        if (existingEntry) {
          if (transaction.amount < 0) {
            existingEntry.Gastado = getTwoFirstDecimals(existingEntry.Gastado - transaction.amount)
          } else {
            existingEntry.Ingresado = getTwoFirstDecimals(existingEntry.Ingresado + transaction.amount)
          }
        } else {
          if (transaction.amount < 0) {
            dataMap.set(transaction.category, {
              Categoria: transaction.category,
              Ingresado: 0,
              Gastado: getTwoFirstDecimals(-transaction.amount)
            })
          } else {
            dataMap.set(transaction.category, {
              Categoria: transaction.category,
              Ingresado: getTwoFirstDecimals(transaction.amount),
              Gastado: 0
            })
          }
        }
      })

    categories?.forEach(category => {
      if (!dataMap.has(category.id)) {
        dataMap.set(category.id, { Categoria: category.id, Ingresado: 0, Gastado: 0 })
      }
    })

    let data = Array.from(dataMap.values()).sort((a, b) => (a.Categoria > b.Categoria ? 1 : -1))

    return data
  }

  const getTotalIncome = () => {
    let income =
      transactions
        ?.filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0

    if (parseInt(monthsSelected[1].split('-')[1]) === new Date().getMonth() + 1) {
      income +=
        monthlyTransactionsData?.monthlyTransactions
          .filter(transaction => transaction.amount > 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0
    }

    // Previous month
    if (previousMonth[0] !== '') {
      const incomePreviousMonth =
        transactionsSincePreviousMonthData?.transactions
          .filter(transaction => transaction.date >= previousMonth[0] && transaction.date <= previousMonth[1])
          .filter(transaction => transaction.amount > 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0

      setTotalIncomePreviousMonth(incomePreviousMonth)

      console.log('incomes', income, incomePreviousMonth)
      // Calculate the percentage of change
      if (incomePreviousMonth === 0) {
        setPercentageChangeIncome(100)
      } else {
        const percentageChange = ((income - incomePreviousMonth) / incomePreviousMonth) * 100
        setPercentageChangeIncome(getTwoFirstDecimals(percentageChange))
      }
    }

    return getTwoFirstDecimals(income)
  }

  const getTotalExpense = () => {
    let expense =
      transactions
        ?.filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0

    if (parseInt(monthsSelected[1].split('-')[1]) === new Date().getMonth() + 1) {
      expense +=
        monthlyTransactionsData?.monthlyTransactions
          .filter(transaction => transaction.amount < 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0
    }

    // Previous month
    if (previousMonth[0] !== '') {
      const expensePreviousMonth =
        transactionsSincePreviousMonthData?.transactions
          .filter(transaction => transaction.date >= previousMonth[0] && transaction.date <= previousMonth[1])
          .filter(transaction => transaction.amount < 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0

      setTotalExpensePreviousMonth(expensePreviousMonth)

      // Calculate the percentage of change
      if (expensePreviousMonth === 0) {
        setPercentageChangeExpense(100)
      } else {
        const percentageChange = ((expense - expensePreviousMonth) / expensePreviousMonth) * 100
        setPercentageChangeExpense(getTwoFirstDecimals(percentageChange))
      }
    }

    return getTwoFirstDecimals(-expense)
  }

  const getTableData = () => {
    const dataMap = new Map()
    // data must be type TableReportData ({headers: string[], items: Array<{month: string, income: number, expense: number, balance: number}
    // Add the monthly transactions from the previous month to the second month selected
    transactionsSincePreviousMonthData?.transactions.forEach(transaction => {
      const [year, month, day] = (transaction.date as string)
        .split('T')[0]
        .split('-')
        .map(date => parseInt(date))
      const monthYear = formatMonthYear(year, month - 1, day, 0, 0)
      const existingEntry = dataMap.get(monthYear)
      if (existingEntry) {
        if (transaction.amount > 0) {
          existingEntry.income += transaction.amount
        } else {
          existingEntry.expense -= transaction.amount
        }
      } else {
        dataMap.set(monthYear, {
          month: monthYear,
          income: transaction.amount > 0 ? transaction.amount : 0,
          expense: transaction.amount < 0 ? -transaction.amount : 0
        })
      }
    })

    // Add the monthly transactions if the second month is the current month
    if (parseInt(monthsSelected[1].split('-')[1]) === new Date().getMonth() + 1) {
      monthlyTransactionsData?.monthlyTransactions.forEach(transaction => {
        const [year, month, day] = monthsSelected[1]
          .split('T')[0]
          .split('-')
          .map(date => parseInt(date))
        const monthYear = formatMonthYear(year, month - 1, day, 0, 0)
        const existingEntry = dataMap.get(monthYear)
        if (existingEntry) {
          if (transaction.amount > 0) {
            existingEntry.income += transaction.amount
          } else {
            existingEntry.expense -= transaction.amount
          }
        } else {
          dataMap.set(monthYear, {
            month: monthYear,
            income: transaction.amount > 0 ? transaction.amount : 0,
            expense: transaction.amount < 0 ? -transaction.amount : 0
          })
        }
      })
    }

    // Add the months with no transactions
    const startDate = previousMonth[0].split('-')
    const startDateUTC = new Date(Date.UTC(parseInt(startDate[0]), parseInt(startDate[1]) - 1, parseInt(startDate[2])))
    const endDate = monthsSelected[1].split('-')
    const endDateUTC = new Date(Date.UTC(parseInt(endDate[0]), parseInt(endDate[1]) - 1, parseInt(endDate[2])))

    const currentDate = startDateUTC
    while (currentDate <= endDateUTC) {
      const monthYear = formatMonthYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0)
      if (!dataMap.has(monthYear)) {
        dataMap.set(monthYear, { month: monthYear, income: 0, expense: 0 })
      }
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    const data = Array.from(dataMap.values())
    const headers = ['Mes', 'Ingresos', 'Gastos', 'Balance']
    let items = data.map(item => ({
      sr: 0,
      month: item.month,
      income: item.income,
      expense: item.expense,
      balance: item.income - item.expense
    }))

    // order the items by month
    items = items
      .sort((a, b) => {
        const aMonth = a.month.split(' ')[0]
        const bMonth = b.month.split(' ')[0]
        const aYear = a.month.split(' ')[1]
        const bYear = b.month.split(' ')[1]

        if (aYear !== bYear) {
          return parseInt(aYear) - parseInt(bYear)
        } else {
          return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
        }
      })
      // add the sr field
      .map((item, index) => {
        return {
          sr: index + 1,
          month: item.month,
          income: item.income,
          expense: item.expense,
          balance: item.balance
        }
      })

    return { headers, items }
  }

  useEffect(() => {
    if (generateReport) {
      let previous = new Date(monthsSelected[0])
      previous.setMonth(previous.getMonth() - 1)

      setPreviousMonth([
        formatDate(previous.getFullYear(), previous.getMonth(), 1, 0, 0),
        formatDate(previous.getFullYear(), previous.getMonth() + 1, 0, 23, 59)
      ])
    }
  }, [generateReport])

  useEffect(() => {
    if (generateReport) {
      if (transactions) {
        const oneMonth = monthsSelected[0].split('-')[1] === monthsSelected[1].split('-')[1]
        // setProgress(0)
        setFirstChartSrc(null)
        setSecondLineChartSrc(null)
        setBarChartSrc(null)
        setTableData(null)
        if (oneMonth) {
          setFirstLineChartData(getDailyData())
          setSecondLineChartData(getWeeklyData())
        } else {
          setFirstLineChartData(getWeeklyData())
          setSecondLineChartData(getMonthlyData())
        }

        setBarChartData(getTransactionsByCategory())

        if (previousMonth[0] !== '' && transactionsSincePreviousMonthData) {
          setTotalIncome(getTotalIncome())
          setTotalExpense(getTotalExpense())
          setPercentageChangeBalance(() => {
            const balancePreviousMonth = totalIncomePreviousMonth + totalExpensePreviousMonth
            const balance = totalIncome - totalExpense

            if (balancePreviousMonth === 0) {
              return 100
            } else {
              return getTwoFirstDecimals(((balance - balancePreviousMonth) / balancePreviousMonth) * 100)
            }
          })
          setTableData(getTableData())
        }
      }
    }
  }, [transactions, transactionsSincePreviousMonthData, generateReport, previousMonth])

  useEffect(() => {
    setGenerateReport(false)
  }, [monthsSelected])

  return !isClient ? (
    <></>
  ) : (
    <>
      {generateReport ? (
        <>
          <LineChart data={firstLineChartData} image={firstLineChartSrc} setImage={setFirstChartSrc} />
          <LineChart data={secondLineChartData} image={secondLineChartSrc} setImage={setSecondLineChartSrc} />
          <BarChart data={barChartData} image={barChartSrc} setImage={setBarChartSrc} />
          <PDFDownloadLink
            document={
              <IncomeExpenseReport
                monthsSelected={monthsSelected}
                firstLineChartSrc={firstLineChartSrc ?? imgSrc}
                secondLineChartSrc={secondLineChartSrc ?? imgSrc}
                barChartSrc={barChartSrc ?? imgSrc}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                percentageChangeIncome={percentageChangeIncome}
                percentageChangeExpense={percentageChangeExpense}
                percentageChangeBalance={percentageChangeBalance}
                tableData={tableData}
              />
            }
            fileName="InformeIngresosGastos.pdf"
          >
            {({ loading }) => (
              <Fab
                style={{
                  position: 'fixed',
                  bottom: '86px',
                  right: '20px'
                }}
                color="error"
                disabled={loading || !firstLineChartSrc || !secondLineChartSrc || !barChartSrc}
                // onClick={() => setTimeout(() => setGenerateReport(false), 1000)}
              >
                {loading || !firstLineChartSrc || !secondLineChartSrc || !barChartSrc ? (
                  <CircularProgress
                  // variant="determinate" value={progress}
                  />
                ) : (
                  <Download />
                )}
              </Fab>
            )}
          </PDFDownloadLink>
        </>
      ) : (
        <Fab
          style={{
            position: 'fixed',
            bottom: '86px',
            right: '20px'
          }}
          color="error"
          onClick={() => setGenerateReport(true)}
        >
          <PictureAsPdf />
        </Fab>
      )}
    </>
  )
}

export default DownloadReportButton

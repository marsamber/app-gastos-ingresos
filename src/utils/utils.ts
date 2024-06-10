export const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const monthMap = {
  Ene: 1,
  Feb: 2,
  Mar: 3,
  Abr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Ago: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dic: 12
}

export const getDateWeekOfMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayOfWeek = firstDay.getDay()
  const firstDayOfMonth = dayOfWeek === 0 ? 7 : dayOfWeek
  const week = Math.ceil((date.getDate() + firstDayOfMonth - 1) / 7)
  return week
}

export const getMonthName = (date: Date) => {
  return monthNames[date.getMonth()]
}

export const formatMonthYear = (year: number, month: number, day: number, hour: number, minute: number) => {
  const date = new Date(Date.UTC(year, month, day, hour, minute))
  return `${getMonthName(date)} ${date.getFullYear().toString().substring(2)}`
}

export const convertDate = (date: string) => {
  let [month, year] = date.split(' ')
  return { month: monthMap[month as keyof typeof monthMap], year: parseInt(year) }
}

export const getTwoFirstDecimals = (number: number) => {
  return Number(number.toFixed(2))
}

export const formatDate = (year: number, month: number, day: number, hour: number, minute: number): string => {
  const date = new Date(Date.UTC(year, month, day, hour, minute))
  return date.toISOString()
}

export const formatDayMonthYear = (year: number, month: number, day: number, hour: number, minute: number): string => {
  const date = new Date(Date.UTC(year, month, day, hour, minute))
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
}

export const handleDateFilterChange = (value: string): string[] => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  let monthsSelected = ['', '']

  switch (value) {
    case 'this_month':
      monthsSelected = [
        formatDate(currentYear, currentMonth, 1, 0, 0),
        formatDate(currentYear, currentMonth + 1, 0, 23, 59)
      ]
      break
    case 'last_month':
      monthsSelected = [
        formatDate(currentYear, currentMonth - 1, 1, 0, 0),
        formatDate(currentYear, currentMonth, 0, 23, 59)
      ]
      break
    case 'this_year':
      monthsSelected = [formatDate(currentYear, 0, 1, 0, 0), formatDate(currentYear, 11, 31, 23, 59)]
      break
    case 'last_year':
      monthsSelected = [formatDate(currentYear - 1, 0, 1, 0, 0), formatDate(currentYear - 1, 11, 31, 23, 59)]
      break
  }
  return monthsSelected
}

// API
// Helper para convertir y validar query params
export const parseDate = (dateStr: string | undefined): Date | undefined => {
  return dateStr ? new Date(dateStr) : undefined
}

export const parseIntSafe = (numberStr: string | undefined): number | undefined => {
  return numberStr ? parseInt(numberStr) : undefined
}

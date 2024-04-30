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

export const formatMonthYear = (dateString: string) => {
  const date = new Date(dateString)
  return `${getMonthName(date)} ${date.getFullYear().toString().substring(2)}`
}

export const convertDate = (date: string) => {
  let [month, year] = date.split(' ')
  return { month: monthMap[month as keyof typeof monthMap], year: parseInt(year) }
}

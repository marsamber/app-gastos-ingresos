/* eslint-disable no-unused-vars */
import { formatDate } from '@/utils/utils'
import { KeyboardArrowRight } from '@mui/icons-material'
import { useMediaQuery } from '@mui/material'
import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/navigation'
import '../styles.css'

interface MonthRangePickerProps {
  monthsSelected: [string, string]
  setMonthsSelected: (dates: [string, string]) => void
}

export default function MonthRangePicker({ monthsSelected, setMonthsSelected }: MonthRangePickerProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 600px)')
  dayjs.extend(utc)

  const handleOnChangeDates = (dates: [Dayjs, Dayjs]) => {
    const start = dates[0]
    const end = dates[1]
    setMonthsSelected([
      formatDate(start.year(), start.month(), 1, 0, 0),
      formatDate(end.year(), end.month() + 1, 0, 23, 59)
    ])

    router.push(
      `/?startDate=${formatDate(start.year(), start.month(), 1, 0, 0)}&endDate=${formatDate(end.year(), end.month() + 1, 0, 23, 59)}`
    )
  }

  return (
    <DatePicker.RangePicker
      className="monthRangePicker"
      picker="month"
      placeholder={['Inicio', 'Fin']}
      locale={locale}
      disabledDate={current => current && current.toDate() > new Date()}
      value={[dayjs.utc(monthsSelected[0]), dayjs.utc(monthsSelected[1])]}
      format={'MMM YY'}
      allowClear={false}
      size="large"
      suffixIcon={null}
      separator={<KeyboardArrowRight />}
      allowEmpty={[false, false]}
      inputReadOnly
      onChange={dates => handleOnChangeDates(dates as [Dayjs, Dayjs])}
      style={{
        width: isMobile ? '190px' : '220px',
        marginBottom: '5px',
        paddingBottom: 0,
        paddingLeft: 0,
        paddingTop: 0,
        height: '30px'
      }}
    />
  )
}

/* eslint-disable no-unused-vars */
import { KeyboardArrowRight } from '@mui/icons-material'
import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'
import '../styles.css'
import { useMediaQuery } from '@mui/material'
import { formatDate } from '@/utils/utils'

interface MonthRangePickerProps {
  setMonthsSelected: (dates: [string, string]) => void
}

export default function MonthRangePicker({ setMonthsSelected }: MonthRangePickerProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleOnChangeDates = (monthsSelected: [Dayjs, Dayjs]) => {
    const start = monthsSelected[0]
    const end = monthsSelected[1]
    setMonthsSelected([
      formatDate(start.year(), start.month(), 1, 0, 0),
      formatDate(end.year(), end.month() + 1, 0, 23, 59)
    ])
  }

  return (
    <DatePicker.RangePicker
      className="monthRangePicker"
      picker="month"
      placeholder={['Inicio', 'Fin']}
      locale={locale}
      disabledDate={current => current && current.toDate() > new Date()}
      defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
      format={'MMM YY'}
      allowClear={false}
      size="large"
      suffixIcon={null}
      separator={<KeyboardArrowRight />}
      allowEmpty={[false, false]}
      inputReadOnly
      onChange={dates => handleOnChangeDates(dates as [Dayjs, Dayjs])}
      style={{
        width: isMobile ? '190px':'220px',
        marginBottom: '5px',
        paddingBottom: 0,
        paddingLeft: 0,
        paddingTop: 0,
        height: '30px'
      }}
    />
  )
}

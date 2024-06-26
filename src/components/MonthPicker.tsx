/* eslint-disable no-unused-vars */
import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'
import '../styles.css'
import { formatDate } from '@/utils/utils'

interface MonthPickerProps {
  setMonthSelected: (monthSelected: string) => void
}

export default function MonthPicker({ setMonthSelected }: MonthPickerProps) {
  const handleOnChangeDate = (monthSelected: Dayjs) => {
    setMonthSelected(formatDate(monthSelected.year(), monthSelected.month(), 1, 0, 0))
  }

  return (
    <DatePicker
      className="monthPicker"
      picker="month"
      locale={locale}
      disabledDate={current => current && current.toDate() > new Date()}
      defaultValue={dayjs().startOf('month')}
      format={'MMM YY'}
      allowClear={false}
      // variant="borderless"
      size="large"
      suffixIcon={null}
      inputReadOnly
      onChange={date => handleOnChangeDate(date)}
      style={{
        width: '86px',
        marginBottom: '5px',
        paddingBottom: 0,
        paddingLeft: 0,
        paddingTop: 0,
        height: '30px',
      }}
    />
  )
}

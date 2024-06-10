/* eslint-disable no-unused-vars */
import { formatDate } from '@/utils/utils'
import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  KeyboardDoubleArrowRight,
  KeyboardDoubleArrowLeft
} from '@mui/icons-material'
import { useMediaQuery, IconButton } from '@mui/material'
import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/navigation'
import '../styles.css'
import { use, useEffect, useState } from 'react'

interface MonthRangePickerProps {
  monthsSelected: [string, string]
  setMonthsSelected: (dates: [string, string]) => void
}

export default function MonthRangePicker({ monthsSelected, setMonthsSelected }: MonthRangePickerProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [disabledNext, setDisabledNext] = useState(false)
  dayjs.extend(utc)

  // Method to handle the change of the dates, it will update the state and the URL
  const handleOnChangeDates = (dates: [Dayjs, Dayjs]) => {
    const start = dates[0]
    const end = dates[1]
    setMonthsSelected([
      formatDate(start.year(), start.month(), 1, 0, 0),
      formatDate(end.year(), end.month() + 1, 0, 23, 59)
    ])

    router.push(
      `/?startDate=${formatDate(start.year(), start.month(), 1, 0, 0)}&endDate=${formatDate(
        end.year(),
        end.month() + 1,
        0,
        23,
        59
      )}`
    )
  }

  const handlePrevMonth = () => {
    const start = dayjs.utc(monthsSelected[0]).subtract(1, 'month')
    const end = dayjs.utc(monthsSelected[1]).subtract(1, 'month')
    setMonthsSelected([
      formatDate(start.year(), start.month(), 1, 0, 0),
      formatDate(end.year(), end.month() + 1, 0, 23, 59)
    ])

    router.push(
      `/?startDate=${formatDate(start.year(), start.month(), 1, 0, 0)}&endDate=${formatDate(
        end.year(),
        end.month() + 1,
        0,
        23,
        59
      )}`
    )
  }

  const handleNextMonth = () => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    const endDateSelected = dayjs.utc(monthsSelected[1])

    const start = dayjs.utc(monthsSelected[0]).add(1, 'month')
    let end = dayjs.utc(monthsSelected[1]).add(1, 'month')
    // If the end date is the current month, we will not allow to go to the next month
    if (endDateSelected.year() === currentYear && endDateSelected.month() === currentMonth) {
      end = dayjs.utc(monthsSelected[1])
    }
    setMonthsSelected([
      formatDate(start.year(), start.month(), 1, 0, 0),
      formatDate(end.year(), end.month() + 1, 0, 23, 59)
    ])

    router.push(
      `/?startDate=${formatDate(start.year(), start.month(), 1, 0, 0)}&endDate=${formatDate(
        end.year(),
        end.month() + 1,
        0,
        23,
        59
      )}`
    )
  }

  useEffect(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    const start = dayjs.utc(monthsSelected[0])
    const end = dayjs.utc(monthsSelected[1])

    // If the start and end date are the current month, we will not allow to go to the next month
    if (
      start.year() === currentYear &&
      start.month() === currentMonth &&
      end.year() === currentYear &&
      end.month() === currentMonth
    ) {
      setDisabledNext(true)
    } else {
      setDisabledNext(false)
    }
  }, [monthsSelected])

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handlePrevMonth}>
        <KeyboardDoubleArrowLeft />
      </IconButton>
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
      <IconButton disabled={disabledNext} onClick={handleNextMonth}>
        <KeyboardDoubleArrowRight />
      </IconButton>
    </div>
  )
}

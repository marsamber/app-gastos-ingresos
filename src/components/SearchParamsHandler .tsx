/* eslint-disable no-unused-vars */
'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { formatDate } from '@/utils/utils'

interface SearchParamsHandlerProps {
  setMonthsSelected: (dates: [string, string]) => void
}

const SearchParamsHandler = ({ setMonthsSelected }: SearchParamsHandlerProps) => {
  const today = new Date()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams && searchParams.has('startDate') && searchParams.has('endDate')) {
      setMonthsSelected([searchParams.get('startDate') as string, searchParams.get('endDate') as string])
    } else {
      setMonthsSelected([
        formatDate(today.getFullYear(), today.getMonth(), 1, 0, 0),
        formatDate(today.getFullYear(), today.getMonth() + 1, 0, 23, 59)
      ])
    }
  }, [searchParams, setMonthsSelected])

  return null
}

export default SearchParamsHandler

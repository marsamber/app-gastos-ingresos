import customFetch from '@/utils/fetchWrapper'
import { useEffect, useState } from 'react'

export default function useFetch<D = unknown, E = unknown>(url: string, options?: globalThis.RequestInit) {
  const [data, setData] = useState<D | null>(null)
  const [error, setError] = useState<E | null>(null)
  const [loading, setLoading] = useState(true)

  async function refetch() {
    try {
      const response = await customFetch(url, options)
      const data = await response.json() as D
      setData(data)
      setLoading(false)
    } catch (error: unknown) {
      setError(error as E)
      setLoading(false)
    }
  }

  useEffect(() => {
    void refetch()
  }, [url])

  return { data, error, loading, refetch }
}

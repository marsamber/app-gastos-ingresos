import { useEffect, useState } from 'react'

export default function useFetch<D = any, E = unknown>(url: string, options?: RequestInit) {
  const [data, setData] = useState<D | null>(null)
  const [error, setError] = useState<E | null>(null)
  const [loading, setLoading] = useState(true)

  async function refetch() {
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      setData(data)
      setLoading(false)
    } catch (error: any) {
      setError(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [url])

  return { data, error, loading, refetch }
}

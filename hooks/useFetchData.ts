// hooks/useFetchData.ts
import { useQuery } from '@tanstack/react-query'

interface FetchOptions {
  params?: Record<string, string>
  headers?: Record<string, string>
  enabled?: boolean
}

export const useFetchData = <T = any>(key: string, url: string, options?: FetchOptions) => {
  const { params, headers, enabled = true } = options || {}

  const queryString = params
    ? '?' + new URLSearchParams(params).toString()
    : ''

  const fetchData = async (): Promise<T> => {
    const res = await fetch(`${url}${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    }

    return res.json()
  }

  return useQuery<T>({
    queryKey: [key, params],
    queryFn: fetchData,
    enabled,
  })
}

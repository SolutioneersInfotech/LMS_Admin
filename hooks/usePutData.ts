// hooks/usePutData.ts
import { useMutation } from '@tanstack/react-query'

interface PutOptions {
  headers?: Record<string, string>
}

export const usePutData = <T = any, V = any>(url: string, options?: PutOptions) => {
  const { headers } = options || {}

  const putData = async (data: V): Promise<T> => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to update data')
    }

    return res.json()
  }

  return useMutation<T, Error, V>({
    mutationFn: putData,
  })
}

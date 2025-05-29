// hooks/useDeleteData.ts
import { useMutation } from '@tanstack/react-query'

interface DeleteOptions {
  headers?: Record<string, string>
}

/**
 * useDeleteData - React Query + fetch-based custom hook for DELETE requests.
 *
 * @param url - The API endpoint to delete the resource.
 * @param options - Optional headers like Authorization, etc.
 */
export const useDeleteData = <T = any>(url: string, options?: DeleteOptions) => {
  const { headers } = options || {}

  const deleteData = async (): Promise<T> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to delete resource')
    }

    return res.json()
  }

  return useMutation<T, Error>({
    mutationFn: deleteData,
  })
}

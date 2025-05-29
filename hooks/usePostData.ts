// hooks/usePostData.ts
import { useMutation } from '@tanstack/react-query'

interface PostOptions {
  headers?: Record<string, string>
}

export const usePostData = <T = any, V = any>(url: string, options?: PostOptions) => {
  const { headers } = options || {}

  const postData = async (data: V): Promise<T> => {
    console.log("datadata", data)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Something went wrong')
    }

    return res.json()
  }

  return useMutation<T, Error, V>({
    mutationFn: postData,
  })
}

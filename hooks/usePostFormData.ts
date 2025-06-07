// hooks/usePostFormData.ts
import { useMutation } from '@tanstack/react-query'

export const usePostFormData = <T = any>(url: string) => {
  const postFormData = async (formData: FormData): Promise<T> => {
    // ✅ Log FormData properly

    console.log("hvjavjhavjhvaj")
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }

    const res = await fetch(url, {
      method: 'POST',
      body: formData, // ✅ No headers — browser sets Content-Type
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Something went wrong')
    }

    return res.json()
  }

  return useMutation<T, Error, FormData>({
    mutationFn: postFormData,
  })
}

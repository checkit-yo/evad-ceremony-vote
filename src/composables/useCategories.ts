import type { Category } from '~/types'

export function useCategories() {
  return useFetch<Category[]>('/api/categories', {
    key: 'categories',
    default: () => [],
  })
}

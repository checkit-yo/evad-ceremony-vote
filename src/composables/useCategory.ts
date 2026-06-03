import type { CategoryWithNominees } from '~/types'

export function useCategory(slug: MaybeRefOrGetter<string>) {
  return useFetch<CategoryWithNominees>(() => `/api/categories/${toValue(slug)}`, {
    key: () => `category:${toValue(slug)}`,
  })
}

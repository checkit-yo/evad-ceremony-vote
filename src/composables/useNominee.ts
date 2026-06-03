import type { NomineeWithCategory } from '~/types'

export function useNominee(id: MaybeRefOrGetter<string>) {
  return useFetch<NomineeWithCategory>(() => `/api/nominees/${toValue(id)}`, {
    key: () => `nominee:${toValue(id)}`,
  })
}

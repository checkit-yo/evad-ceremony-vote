/**
 * Composable d'authentification admin côté client.
 * Le password est stocké en sessionStorage + reactive shared state, propagé via Authorization Bearer.
 */
export function useAdminPassword() {
  return useState<string>('admin-password', () => {
    if (import.meta.client) {
      return sessionStorage.getItem('admin-password') ?? ''
    }
    return ''
  })
}

export function setAdminPassword(password: string) {
  const pw = useAdminPassword()
  pw.value = password
  if (import.meta.client) {
    if (password) sessionStorage.setItem('admin-password', password)
    else sessionStorage.removeItem('admin-password')
  }
}

export function adminFetch<T = unknown>(url: string, opts: any = {}): Promise<T> {
  const pw = useAdminPassword()
  return $fetch<T>(url, {
    ...opts,
    headers: {
      ...(opts.headers ?? {}),
      Authorization: `Bearer ${pw.value}`,
    },
  })
}

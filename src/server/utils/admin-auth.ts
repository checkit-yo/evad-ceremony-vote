import type { H3Event } from 'h3'

export function extractAdminPassword(event: H3Event): string | null {
  const auth = getRequestHeader(event, 'authorization')
  if (auth?.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length).trim()
  }
  const query = getQuery(event)
  if (typeof query.password === 'string') return query.password
  return null
}

export function requireAdmin(event: H3Event): void {
  const config = useRuntimeConfig()
  const provided = extractAdminPassword(event)
  if (!provided || provided !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès admin refusé.',
    })
  }
}

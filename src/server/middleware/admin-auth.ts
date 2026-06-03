import { requireAdmin } from '~/server/utils/admin-auth'

export default defineEventHandler((event) => {
  const url = event.path || event.node.req.url || ''
  if (!url.startsWith('/api/admin/')) return
  requireAdmin(event)
})

import { renderOtpEmail } from '../../utils/resend'

export default defineEventHandler((event) => {
  // Only available in development
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  // Allow customizing preview via query params
  const query = getQuery(event)

  const html = renderOtpEmail({
    code: (query.code as string) || '847293',
    categoryName: (query.category as string) || 'Meilleur Artiste',
    nomineeName: (query.nominee as string) || 'Marie Dupont',
  })

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return html
})

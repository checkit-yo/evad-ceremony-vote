import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = typeof query.category_id === 'string' ? query.category_id : undefined

  const supabase = useSupabaseAdmin()
  let q = supabase
    .from('nominees')
    .select('id, category_id, name, description, image_url, display_order, created_at, updated_at')
    .order('display_order', { ascending: true })

  if (categoryId) q = q.eq('category_id', categoryId)

  const { data, error } = await q
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data ?? []
})

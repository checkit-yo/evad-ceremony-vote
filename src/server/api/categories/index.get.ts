import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, description, display_order, nominees(count)')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (categories) : ${error.message}` })
  }
  return (data ?? []).map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    display_order: c.display_order,
    nominee_count: c.nominees?.[0]?.count ?? 0,
  }))
})

import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requis.' })

  const body = await readBody<{
    slug?: string
    name?: string
    description?: string
    youtube_url?: string | null
    display_order?: number
  }>(event)

  const updates: Record<string, unknown> = {}
  if (body.slug !== undefined) {
    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      throw createError({ statusCode: 400, statusMessage: 'Slug invalide.' })
    }
    updates.slug = body.slug
  }
  if (body.name !== undefined) updates.name = body.name
  if (body.description !== undefined) updates.description = body.description
  if (body.youtube_url !== undefined) updates.youtube_url = body.youtube_url
  if (body.display_order !== undefined) updates.display_order = body.display_order

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun champ à mettre à jour.' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select('id, slug, name, description, youtube_url, display_order')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Ce slug est déjà utilisé.' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

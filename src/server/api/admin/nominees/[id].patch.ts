import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requis.' })

  const body = await readBody<{
    category_id?: string
    name?: string
    description?: string
    display_order?: number
    image_url?: string | null
  }>(event)

  const updates: Record<string, unknown> = {}
  if (body.category_id !== undefined) updates.category_id = body.category_id
  if (body.name !== undefined) updates.name = body.name
  if (body.description !== undefined) updates.description = body.description
  if (body.display_order !== undefined) updates.display_order = body.display_order
  if (body.image_url !== undefined) updates.image_url = body.image_url

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun champ à mettre à jour.' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('nominees')
    .update(updates)
    .eq('id', id)
    .select('id, category_id, name, description, image_url, display_order')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Un nominé avec ce nom existe déjà dans cette catégorie.' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

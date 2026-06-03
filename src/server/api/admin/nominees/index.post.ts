import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    category_id?: string
    name?: string
    description?: string
    display_order?: number
    image_url?: string | null
  }>(event)

  if (!body?.category_id || !body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'category_id et nom requis.' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('nominees')
    .insert({
      category_id: body.category_id,
      name: body.name,
      description: body.description ?? '',
      display_order: body.display_order ?? 0,
      image_url: body.image_url ?? null,
    })
    .select('id, category_id, name, description, image_url, display_order')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Un nominé avec ce nom existe déjà dans cette catégorie.' })
    }
    if (error.code === '23503') {
      throw createError({ statusCode: 404, statusMessage: 'Catégorie introuvable.' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

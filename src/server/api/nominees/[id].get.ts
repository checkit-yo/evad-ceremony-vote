import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requis.' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('nominees')
    .select('id, category_id, name, description, image_url, display_order, categories ( id, slug, name )')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (nominee) : ${error.message}` })
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Nommé introuvable.' })
  }

  const { categories: category, ...nominee } = data as any
  return { ...nominee, category }
})

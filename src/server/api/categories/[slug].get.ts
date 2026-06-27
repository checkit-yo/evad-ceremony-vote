import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug requis.' })
  }

  const supabase = useSupabaseAdmin()
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id, slug, name, description, youtube_url, display_order')
    .eq('slug', slug)
    .maybeSingle()

  if (catError) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (category) : ${catError.message}` })
  }
  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Catégorie introuvable.' })
  }

  const { data: nominees, error: nomError } = await supabase
    .from('nominees')
    .select('id, name, description, image_url, display_order')
    .eq('category_id', category.id)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (nomError) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (nominees) : ${nomError.message}` })
  }

  return {
    ...category,
    nominees: nominees ?? [],
  }
})

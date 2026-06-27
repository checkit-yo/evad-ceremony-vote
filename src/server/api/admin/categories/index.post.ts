import { useSupabaseAdmin } from '~/server/utils/supabase'
import { slugify } from '~/server/utils/slug'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    slug?: string
    name?: string
    description?: string
    youtube_url?: string
    display_order?: number
  }>(event)

  if (!body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'Nom requis.' })
  }

  const slug = body.slug ? body.slug : slugify(body.name)
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Impossible de générer un slug valide depuis ce nom.' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      slug,
      name: body.name,
      description: body.description ?? '',
      youtube_url: body.youtube_url ?? null,
      display_order: body.display_order ?? 0,
    })
    .select('id, slug, name, description, youtube_url, display_order')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: `Une catégorie avec un nom similaire existe déjà (slug "${slug}").` })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

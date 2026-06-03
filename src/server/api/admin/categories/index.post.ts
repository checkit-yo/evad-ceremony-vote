import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    slug?: string
    name?: string
    description?: string
    display_order?: number
  }>(event)

  if (!body?.slug || !body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'Slug et nom requis.' })
  }
  if (!/^[a-z0-9-]+$/.test(body.slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets.' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      slug: body.slug,
      name: body.name,
      description: body.description ?? '',
      display_order: body.display_order ?? 0,
    })
    .select('id, slug, name, description, display_order')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Ce slug est déjà utilisé.' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

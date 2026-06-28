import { useSupabaseAdmin } from '~/server/utils/supabase'
import { uploadNomineeImage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requis.' })

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun fichier reçu.' })
  }

  const file = formData.find(f => f.name === 'image' && f.filename)
  if (!file || !file.data || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'Champ "image" manquant ou invalide.' })
  }

  const supabase = useSupabaseAdmin()

  // Vérifier que le nommé existe avant d'uploader
  const { data: nominee, error: lookupErr } = await supabase
    .from('nominees')
    .select('id')
    .eq('id', id)
    .maybeSingle()
  if (lookupErr) throw createError({ statusCode: 500, statusMessage: lookupErr.message })
  if (!nominee) throw createError({ statusCode: 404, statusMessage: 'Nommé introuvable.' })

  const publicUrl = await uploadNomineeImage({
    nomineeId: id,
    data: file.data,
    mimeType: file.type,
    originalName: file.filename,
  })

  const { data, error } = await supabase
    .from('nominees')
    .update({ image_url: publicUrl })
    .eq('id', id)
    .select('id, image_url')
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

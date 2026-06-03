import { useSupabaseAdmin } from './supabase'

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function uploadNomineeImage(opts: {
  nomineeId: string
  data: Buffer
  mimeType: string
  originalName?: string
}): Promise<string> {
  if (!ALLOWED_MIME.has(opts.mimeType)) {
    throw createError({
      statusCode: 415,
      statusMessage: `Format d'image non supporté (${opts.mimeType}). Utilisez PNG, JPEG ou WebP.`,
    })
  }
  if (opts.data.length > MAX_SIZE_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: `Image trop volumineuse (${(opts.data.length / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`,
    })
  }

  const config = useRuntimeConfig()
  const bucket = config.supabaseStorageBucket
  const ext = extensionForMime(opts.mimeType)
  const path = `${opts.nomineeId}/${Date.now()}.${ext}`

  const supabase = useSupabaseAdmin()
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, opts.data, {
      contentType: opts.mimeType,
      upsert: true,
      cacheControl: '3600',
    })
  if (uploadError) {
    throw createError({
      statusCode: 502,
      statusMessage: `Échec de l'upload image : ${uploadError.message}`,
    })
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case 'image/png': return 'png'
    case 'image/webp': return 'webp'
    case 'image/jpeg':
    case 'image/jpg':
    default: return 'jpg'
  }
}

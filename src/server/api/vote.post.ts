import { useSupabaseAdmin } from '~/server/utils/supabase'
import { generateOtpCode, hashOtp, isValidEmail, normalizeEmail } from '~/server/utils/otp'
import { sendOtpEmail } from '~/server/utils/resend'

const RATE_LIMIT_WINDOW_SECONDS = 60
const OTP_TTL_MINUTES = 10

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, nomineeId?: string, categoryId?: string }>(event)
  const rawEmail = body?.email
  const nomineeId = body?.nomineeId
  const categoryId = body?.categoryId

  if (!rawEmail || !nomineeId || !categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Email, nomineeId et categoryId sont requis.' })
  }
  if (!isValidEmail(rawEmail)) {
    throw createError({ statusCode: 400, statusMessage: 'Format d\'email invalide.' })
  }

  const email = normalizeEmail(rawEmail)
  const supabase = useSupabaseAdmin()

  // 1) Vérifier que le nominé existe et appartient à la catégorie + récupérer noms pour l'email
  const { data: nominee, error: nomineeError } = await supabase
    .from('nominees')
    .select('id, name, category_id, categories ( id, name )')
    .eq('id', nomineeId)
    .eq('category_id', categoryId)
    .maybeSingle()
  if (nomineeError) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (lookup nominé) : ${nomineeError.message}` })
  }
  if (!nominee) {
    throw createError({ statusCode: 404, statusMessage: 'Nominé non trouvé pour cette catégorie.' })
  }
  const categoryName = (nominee as any).categories?.name ?? ''
  const nomineeName = nominee.name

  // 2) Anti-double-vote
  const { data: existingVote, error: voteError } = await supabase
    .from('votes')
    .select('id')
    .eq('email', email)
    .eq('category_id', categoryId)
    .maybeSingle()
  if (voteError) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (lookup vote) : ${voteError.message}` })
  }
  if (existingVote) {
    return {
      success: false,
      alreadyVoted: true,
      message: 'Vous avez déjà voté dans cette catégorie.',
    }
  }

  // 3) Rate limit : pas plus d'un OTP par 60s pour (email, category)
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString()
  const { count: recentCount, error: rlError } = await supabase
    .from('otp_codes')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .eq('category_id', categoryId)
    .gte('created_at', since)
  if (rlError) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (rate limit) : ${rlError.message}` })
  }
  if ((recentCount ?? 0) >= 1) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Veuillez patienter une minute avant de demander un nouveau code.',
    })
  }

  // 4) Générer + insérer l'OTP
  const code = generateOtpCode()
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString()
  const { error: insertError } = await supabase
    .from('otp_codes')
    .insert({
      email,
      category_id: categoryId,
      nominee_id: nomineeId,
      code_hash: hashOtp(code),
      expires_at: expiresAt,
    })
  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (insert OTP) : ${insertError.message}` })
  }

  // 5) Envoyer l'email. Fallback dev : si pas de RESEND_API_KEY, log console.
  const config = useRuntimeConfig()
  if (config.resendApiKey) {
    await sendOtpEmail({ to: email, code, categoryName, nomineeName })
  } else {
    console.warn(`[DEV] RESEND_API_KEY absent. Code OTP pour ${email} : ${code}`)
  }

  return {
    success: true,
    message: 'Un code de vérification a été envoyé à votre adresse email.',
    ...(process.env.NODE_ENV !== 'production' && !config.resendApiKey ? { debugOtp: code } : {}),
  }
})

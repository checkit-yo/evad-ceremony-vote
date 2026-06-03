import { useSupabaseAdmin } from '~/server/utils/supabase'
import { hashOtp, normalizeEmail } from '~/server/utils/otp'

const MAX_ATTEMPTS = 5

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, code?: string }>(event)
  const rawEmail = body?.email
  const rawCode = body?.code

  if (!rawEmail || !rawCode) {
    throw createError({ statusCode: 400, statusMessage: 'Email et code sont requis.' })
  }

  const email = normalizeEmail(rawEmail)
  const code = rawCode.trim()
  const supabase = useSupabaseAdmin()

  // Récupérer le dernier OTP non consommé non expiré
  const { data: otpRow, error: otpErr } = await supabase
    .from('otp_codes')
    .select('id, email, category_id, nominee_id, code_hash, expires_at, attempts, consumed_at')
    .eq('email', email)
    .is('consumed_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (otpErr) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (lookup OTP) : ${otpErr.message}` })
  }
  if (!otpRow) {
    return {
      success: false,
      message: 'Aucun code de vérification valide trouvé. Veuillez en demander un nouveau.',
    }
  }

  // Limite tentatives
  if (otpRow.attempts >= MAX_ATTEMPTS) {
    await supabase
      .from('otp_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('id', otpRow.id)
    return {
      success: false,
      message: 'Trop de tentatives. Veuillez demander un nouveau code.',
    }
  }

  // Vérification du code
  if (hashOtp(code) !== otpRow.code_hash) {
    await supabase
      .from('otp_codes')
      .update({ attempts: otpRow.attempts + 1 })
      .eq('id', otpRow.id)
    const remaining = MAX_ATTEMPTS - (otpRow.attempts + 1)
    return {
      success: false,
      message: remaining > 0
        ? `Code invalide. Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}.`
        : 'Code invalide. Veuillez demander un nouveau code.',
    }
  }

  // Code OK → enregistrer le vote atomiquement via RPC
  const { error: rpcError } = await supabase.rpc('record_vote', {
    p_email: email,
    p_category_id: otpRow.category_id,
    p_nominee_id: otpRow.nominee_id,
    p_otp_id: otpRow.id,
  })
  if (rpcError) {
    // 23505 = unique_violation → déjà voté
    if (rpcError.code === '23505' || rpcError.message?.includes('votes_email_category_unique')) {
      await supabase
        .from('otp_codes')
        .update({ consumed_at: new Date().toISOString() })
        .eq('id', otpRow.id)
      return {
        success: false,
        alreadyVoted: true,
        message: 'Vous avez déjà voté dans cette catégorie.',
      }
    }
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (record_vote) : ${rpcError.message}` })
  }

  return {
    success: true,
    message: 'Votre vote a été enregistré avec succès !',
  }
})

import { hasVoted, otpStore, getNomineeById } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, nomineeId, categoryId } = body

  // Validate input
  if (!email || !nomineeId || !categoryId) {
    throw createError({
      statusCode: 400,
      message: 'Email, nomineeId et categoryId sont requis.',
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: 'Format d\'email invalide.',
    })
  }

  // Check if nominee exists
  const nominee = getNomineeById(nomineeId)
  if (!nominee) {
    throw createError({
      statusCode: 404,
      message: 'Nominé non trouvé.',
    })
  }

  // Check if already voted
  if (hasVoted(email, categoryId)) {
    return {
      success: false,
      alreadyVoted: true,
      message: 'Vous avez déjà voté dans cette catégorie.',
    }
  }

  // Generate OTP (6 digits)
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Store OTP with expiration (10 minutes)
  otpStore.set(email, {
    code: otp,
    nomineeId,
    categoryId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  })

  // In production, you would send an email here
  // For now, we'll just log it (mock behavior)
  console.log(`[MOCK EMAIL] Code de vérification pour ${email}: ${otp}`)

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    success: true,
    message: 'Code de vérification envoyé.',
    // In development, return the OTP for testing (remove in production!)
    ...(process.env.NODE_ENV === 'development' && { debugOtp: otp }),
  }
})

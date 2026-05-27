import { otpStore, votes, hasVoted } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, code } = body

  // Validate input
  if (!email || !code) {
    throw createError({
      statusCode: 400,
      message: 'Email et code sont requis.',
    })
  }

  // Get stored OTP
  const storedData = otpStore.get(email)

  if (!storedData) {
    return {
      success: false,
      message: 'Aucun code de vérification trouvé. Veuillez recommencer.',
    }
  }

  // Check expiration
  if (new Date() > storedData.expiresAt) {
    otpStore.delete(email)
    return {
      success: false,
      message: 'Le code a expiré. Veuillez recommencer.',
    }
  }

  // Verify code
  if (storedData.code !== code) {
    return {
      success: false,
      message: 'Code invalide. Veuillez vérifier et réessayer.',
    }
  }

  // Double-check not already voted (race condition prevention)
  if (hasVoted(email, storedData.categoryId)) {
    otpStore.delete(email)
    return {
      success: false,
      message: 'Vous avez déjà voté dans cette catégorie.',
    }
  }

  // Record the vote
  votes.push({
    nomineeId: storedData.nomineeId,
    categoryId: storedData.categoryId,
    email,
    votedAt: new Date(),
  })

  // Clean up OTP
  otpStore.delete(email)

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    success: true,
    message: 'Votre vote a été enregistré avec succès !',
  }
})

import { Resend } from 'resend'

let _resend: Resend | null = null

function client(): Resend {
  if (_resend) return _resend
  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Resend non configuré (RESEND_API_KEY manquant).',
    })
  }
  _resend = new Resend(config.resendApiKey)
  return _resend
}

export async function sendOtpEmail(opts: {
  to: string
  code: string
  categoryName: string
  nomineeName: string
}): Promise<void> {
  const config = useRuntimeConfig()
  const html = renderOtpEmail(opts)
  const text =
    `Votre code de vérification pour voter dans la catégorie "${opts.categoryName}" est : ${opts.code}\n` +
    `Ce code expire dans 10 minutes.`

  const { error } = await client().emails.send({
    from: config.resendFromEmail,
    to: opts.to,
    subject: `Votre code EVAD : ${opts.code}`,
    html,
    text,
  })
  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: `Échec d'envoi du code par email : ${error.message}`,
    })
  }
}

function renderOtpEmail({
  code,
  categoryName,
  nomineeName,
}: {
  code: string
  categoryName: string
  nomineeName: string
}): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #5d0e16; color: #e0c8a9; padding: 40px 32px;">
    <h1 style="color: #ffcb39; font-weight: 300; letter-spacing: 0.08em; margin: 0 0 24px; text-transform: uppercase;">EVAD Ceremony</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">
      Vous êtes sur le point de voter pour <strong style="color: #ffcb39;">${escapeHtml(nomineeName)}</strong>
      dans la catégorie <strong>${escapeHtml(categoryName)}</strong>.
    </p>
    <p style="margin: 0 0 8px; line-height: 1.6;">Votre code de vérification :</p>
    <div style="font-size: 32px; letter-spacing: 0.4em; color: #ffcb39; text-align: center; padding: 24px; border: 1px solid rgba(255,203,57,0.4); margin: 24px 0; font-weight: 600;">
      ${escapeHtml(code)}
    </div>
    <p style="font-size: 13px; opacity: 0.7; margin: 0; line-height: 1.6;">
      Ce code est valable 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message — aucun vote ne sera enregistré.
    </p>
  </div>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

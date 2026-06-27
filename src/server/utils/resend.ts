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
    `EVAD CEREMONY\n\n` +
    `Vous êtes sur le point de voter dans la catégorie « ${opts.categoryName} » pour ${opts.nomineeName}.\n\n` +
    `Votre code de vérification : ${opts.code}\n\n` +
    `Validez ce code sur la plateforme pour finaliser votre vote.\n` +
    `Ce code expire dans 10 minutes.`

  const { error } = await client().emails.send({
    from: config.resendFromEmail,
    to: opts.to,
    subject: `EVAD CEREMONY — Votre code : ${opts.code}`,
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

export function renderOtpEmail({
  code,
  categoryName,
  nomineeName,
}: {
  code: string
  categoryName: string
  nomineeName: string
}): string {
  const c = {
    burgundy: '#5d0e16',
    burgundyDeep: '#3a0810',
    gold: '#ffcb39',
    goldDim: 'rgba(255,203,57,0.35)',
    cream: '#e0c8a9',
    creamMuted: '#a89378',
    border: 'rgba(224,200,169,0.18)',
  }
  const fontStack = `"Helvetica Neue", Helvetica, Arial, sans-serif`

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EVAD Ceremony — Votre code</title>
</head>
<body style="margin:0;padding:0;background:${c.burgundyDeep};font-family:${fontStack};">
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.burgundyDeep};padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${c.burgundy};border:1px solid ${c.border};">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px 40px;text-align:center;border-bottom:1px solid ${c.border};">
              <!-- Eyebrow -->
              <p style="margin:0 0 12px 0;color:${c.gold};font-size:10px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;font-family:${fontStack};">
                EVAD Creation
              </p>
              <!-- Title -->
              <h1 style="margin:0;color:${c.cream};font-size:28px;font-weight:300;letter-spacing:0.25em;text-transform:uppercase;font-family:${fontStack};">
                EVAD Ceremony
              </h1>
              <!-- Gold divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:20px;">
                <tr>
                  <td style="width:48px;height:1px;background:${c.gold};line-height:1px;font-size:1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 16px 40px;">
              <p style="margin:0 0 24px 0;color:${c.cream};font-size:15px;line-height:1.7;font-family:${fontStack};">
                Vous êtes sur le point de voter dans la catégorie
                <span style="color:${c.gold};font-weight:600;">${escapeHtml(categoryName)}</span>
                pour
                <span style="color:${c.gold};font-weight:600;">${escapeHtml(nomineeName)}</span>.
              </p>

              <p style="margin:0 0 12px 0;color:${c.creamMuted};font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;font-family:${fontStack};">
                Votre code de vérification
              </p>

              <!-- OTP Code Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
                <tr>
                  <td align="center" style="border:1px solid ${c.goldDim};padding:24px 16px;background:${c.burgundyDeep};">
                    <span style="color:${c.gold};font-size:34px;font-weight:600;letter-spacing:0.5em;font-family:${fontStack};">${escapeHtml(code)}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;color:${c.cream};font-size:14px;line-height:1.7;font-family:${fontStack};">
                Validez ce code sur la plateforme pour finaliser votre vote.
              </p>
              <p style="margin:0;color:${c.creamMuted};font-size:13px;line-height:1.7;font-family:${fontStack};">
                Ce code est valable pendant <strong style="color:${c.cream};">10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 40px 40px;border-top:1px solid ${c.border};">
              <p style="margin:0;color:${c.creamMuted};font-size:12px;line-height:1.6;font-family:${fontStack};">
                Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message — aucun vote ne sera enregistré.
              </p>
            </td>
          </tr>
        </table>

        <!-- Outside footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin-top:24px;">
          <tr>
            <td align="center" style="padding:0 8px;">
              <p style="margin:0;color:${c.creamMuted};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:${fontStack};">
                © EVAD Ceremony · 18 Octobre 2026
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

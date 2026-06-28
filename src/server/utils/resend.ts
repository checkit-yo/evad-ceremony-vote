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
    goldDim: '#665226',
    cream: '#e0c8a9',
    creamMuted: '#a89378',
    border: '#3d2520',
  }
  const fontStack = `"Helvetica Neue", Helvetica, Arial, sans-serif`

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="only">
<meta name="supported-color-schemes" content="only">
<title>EVAD Ceremony — Votre code</title>
<!--[if mso]>
<style type="text/css">
  body, table, td, p, span, h1 { font-family: Arial, sans-serif !important; }
</style>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style type="text/css">
  body, table, td, p, a, span { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  body { margin: 0 !important; padding: 0 !important; }
  u + #body a { color: inherit; text-decoration: none; }
  #MessageViewBody a { color: inherit; text-decoration: none; }
</style>
</head>
<body id="body" style="margin:0;padding:0;background-color:${c.burgundyDeep};font-family:${fontStack};" bgcolor="${c.burgundyDeep}">
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.burgundyDeep}" style="background-color:${c.burgundyDeep};padding:32px 16px;">
    <tr>
      <td align="center" bgcolor="${c.burgundyDeep}" style="background-color:${c.burgundyDeep};">
        <!-- Card -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.burgundy}" style="max-width:560px;width:100%;background-color:${c.burgundy};border:1px solid ${c.border};">
          <!-- Header -->
          <tr>
            <td bgcolor="${c.burgundy}" style="background-color:${c.burgundy};padding:40px 40px 24px 40px;text-align:center;border-bottom:1px solid ${c.border};">
              <!-- Eyebrow -->
              <p style="margin:0 0 12px 0;font-size:10px;font-weight:600;letter-spacing:4px;text-transform:uppercase;font-family:${fontStack};">
                <font color="${c.gold}" style="color:${c.gold};">EVAD Creation</font>
              </p>
              <!-- Title -->
              <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:4px;text-transform:uppercase;font-family:${fontStack};">
                <font color="${c.cream}" style="color:${c.cream};">EVAD Ceremony</font>
              </h1>
              <!-- Gold divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:20px;">
                <tr>
                  <td bgcolor="${c.gold}" style="width:48px;height:1px;background-color:${c.gold};line-height:1px;font-size:1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="${c.burgundy}" style="background-color:${c.burgundy};padding:36px 40px 16px 40px;">
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;font-family:${fontStack};">
                <font color="${c.cream}" style="color:${c.cream};">Vous êtes sur le point de voter dans la catégorie
                <font color="${c.gold}" style="color:${c.gold};"><strong>${escapeHtml(categoryName)}</strong></font>
                pour
                <font color="${c.gold}" style="color:${c.gold};"><strong>${escapeHtml(nomineeName)}</strong></font>.</font>
              </p>

              <p style="margin:0 0 12px 0;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;font-family:${fontStack};">
                <font color="${c.creamMuted}" style="color:${c.creamMuted};">Votre code de vérification</font>
              </p>

              <!-- OTP Code Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
                <tr>
                  <td align="center" bgcolor="${c.burgundyDeep}" style="border:1px solid ${c.goldDim};padding:24px 16px;background-color:${c.burgundyDeep};">
                    <span style="font-size:34px;font-weight:600;letter-spacing:12px;font-family:${fontStack};">
                      <font color="${c.gold}" style="color:${c.gold};">${escapeHtml(code)}</font>
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:14px;line-height:1.7;font-family:${fontStack};">
                <font color="${c.cream}" style="color:${c.cream};">Validez ce code sur la plateforme pour finaliser votre vote.</font>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.7;font-family:${fontStack};">
                <font color="${c.creamMuted}" style="color:${c.creamMuted};">Ce code est valable pendant <strong><font color="${c.cream}" style="color:${c.cream};">10 minutes</font></strong>.</font>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="${c.burgundy}" style="background-color:${c.burgundy};padding:24px 40px 40px 40px;border-top:1px solid ${c.border};">
              <p style="margin:0;font-size:12px;line-height:1.6;font-family:${fontStack};">
                <font color="${c.creamMuted}" style="color:${c.creamMuted};">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message — aucun vote ne sera enregistré.</font>
              </p>
            </td>
          </tr>
        </table>

        <!-- Outside footer -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;margin-top:24px;">
          <tr>
            <td align="center" bgcolor="${c.burgundyDeep}" style="background-color:${c.burgundyDeep};padding:0 8px;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:${fontStack};">
                <font color="${c.creamMuted}" style="color:${c.creamMuted};">© EVAD Ceremony · 18 Octobre 2026</font>
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

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendContactNotification({ name, email, phone, message, machineId }) {
  const subject = machineId
    ? `[MachiNet] Nouveau message - Machine #${machineId}`
    : `[MachiNet] Nouveau message de contact`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: 900; color: #fff;">MACHI</span><span style="font-size: 24px; font-weight: 900; color: #a855f7;">NET</span>
      </div>
      <h2 style="color: #a855f7; margin-bottom: 24px;">Nouveau message de contact</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #9ca3af; width: 120px;">Nom</td>
          <td style="padding: 10px 0; color: #fff; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #9ca3af;">Email</td>
          <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #a855f7;">${email}</a></td>
        </tr>
        ${phone ? `<tr><td style="padding: 10px 0; color: #9ca3af;">Téléphone</td><td style="padding: 10px 0; color: #fff;">${phone}</td></tr>` : ''}
        ${machineId ? `<tr><td style="padding: 10px 0; color: #9ca3af;">Machine ID</td><td style="padding: 10px 0; color: #fff;">${machineId}</td></tr>` : ''}
      </table>
      <div style="margin-top: 24px; background: #1a1a2e; border: 1px solid #3b1f6e; border-radius: 8px; padding: 16px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">Message</p>
        <p style="color: #fff; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">MachiNet — Plateforme B2B industrielle — Algérie</p>
    </div>
  `

  await transporter.sendMail({
    from: `"MachiNet" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject,
    html,
  })
}

export async function sendNewsletterWelcome({ email }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: 900; color: #fff;">MACHI</span><span style="font-size: 24px; font-weight: 900; color: #a855f7;">NET</span>
      </div>
      <h2 style="color: #fff; margin-bottom: 8px;">Inscription confirmée !</h2>
      <p style="color: #9ca3af;">Vous recevrez nos actualités sur le marché des machines industrielles en Algérie.</p>
      <a href="https://machinet.dz/catalogue" style="display: inline-block; margin-top: 24px; background: #7c3aed; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">
        Voir le catalogue
      </a>
      <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">MachiNet — Plateforme B2B industrielle — Algérie</p>
    </div>
  `
  await transporter.sendMail({
    from: `"MachiNet" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Bienvenue dans la newsletter MachiNet',
    html,
  })
}

export async function sendWelcomeEmail({ name, email, role }) {
  const roleLabel = role === 'seller' ? 'Vendeur' : 'Acheteur'
  const dashboardLink = role === 'seller'
    ? 'https://machinet.dz/dashboard'
    : 'https://machinet.dz/catalogue'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: 900; color: #fff;">MACHI</span><span style="font-size: 24px; font-weight: 900; color: #a855f7;">NET</span>
      </div>
      <h2 style="color: #fff; margin-bottom: 8px;">Bienvenue sur MachiNet, ${name.split(' ')[0]} !</h2>
      <p style="color: #9ca3af;">Votre compte <strong style="color: #a855f7;">${roleLabel}</strong> a été créé avec succès.</p>
      <a href="${dashboardLink}" style="display: inline-block; margin-top: 24px; background: #7c3aed; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">
        ${role === 'seller' ? 'Accéder à mon dashboard' : 'Voir le catalogue'}
      </a>
      <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">MachiNet — Plateforme B2B industrielle — Algérie</p>
    </div>
  `

  await transporter.sendMail({
    from: `"MachiNet" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Bienvenue sur MachiNet !`,
    html,
  })
}

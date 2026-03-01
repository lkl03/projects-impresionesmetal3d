import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

type Payload = {
  name: string;
  email: string;
  whatsapp?: string;
  preferred?: 'email' | 'whatsapp';
  message: string;
  // honeypot
  company?: string;
};

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Payload;

    // Honeypot anti-spam
    if (data.company) {
      return Response.json({ ok: true }, { status: 200 });
    }

    // Validación mínima
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 });
    }

    // ✅ Env vars requeridas
    const SMTP_HOST = requireEnv('SMTP_HOST'); // ej: smtp.hostinger.com
    const SMTP_PORT = Number(requireEnv('SMTP_PORT')); // ej: 587 o 465
    const SMTP_USER = requireEnv('SMTP_USER'); // ej: impresion3d@bioprotece.com
    const SMTP_PASS = requireEnv('SMTP_PASS'); // password mailbox
    const MAIL_TO = process.env.MAIL_TO || 'impresion3d@bioprotece.com';
    const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

    if (!Number.isFinite(SMTP_PORT)) {
      throw new Error(`Invalid SMTP_PORT: ${process.env.SMTP_PORT}`);
    }

    const secure = SMTP_PORT === 465;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    await transporter.verify();

    const subject = `Nueva consulta web — ${data.name}`;
    const preferred = data.preferred === 'whatsapp' ? 'WhatsApp' : 'Email';

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Nueva consulta desde la web</h2>
        <p><b>Nombre:</b> ${escapeHtml(data.name)}</p>
        <p><b>Email:</b> ${escapeHtml(data.email)}</p>
        <p><b>WhatsApp:</b> ${escapeHtml(data.whatsapp ?? '-')}</p>
        <p><b>Preferencia:</b> ${escapeHtml(preferred)}</p>
        <hr />
        <p style="white-space: pre-line;"><b>Mensaje:</b><br/>${escapeHtml(data.message)}</p>
      </div>
    `;

    const text = [
      'Nueva consulta desde la web',
      `Nombre: ${data.name}`,
      `Email: ${data.email}`,
      `WhatsApp: ${data.whatsapp ?? '-'}`,
      `Preferencia: ${preferred}`,
      '',
      'Mensaje:',
      data.message
    ].join('\n');

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: data.email,
      subject,
      text,
      html
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    // ✅ IMPORTANTÍSIMO: así Vercel te muestra el motivo real
    console.error('CONTACT_API_ERROR', err);
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}


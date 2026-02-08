// lib/email.ts
// Cloudflare Workers compatible email using HTTP-based API (Elastic Email REST API)
// nodemailer cannot be used on Cloudflare Workers because it relies on Node.js TCP/TLS sockets

const ELASTIC_EMAIL_API_URL = 'https://api.elasticemail.com/v2/email/send';

function getEmailConfig() {
  const apiKey = process.env.ELASTIC_EMAIL_API_KEY || process.env.SMTP_PASSWORD || process.env.ELASTIC_EMAIL_PASSWORD;
  const fromEmail = process.env.MAIL_FROM || process.env.SMTP_USER || process.env.ELASTIC_EMAIL_USER;
  const replyTo = process.env.MAIL_REPLY_TO;
  return { apiKey, fromEmail, replyTo };
}

export function isEmailConfigured(): boolean {
  const { apiKey, fromEmail } = getEmailConfig();
  return !!(apiKey && fromEmail);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { apiKey, fromEmail, replyTo } = getEmailConfig();

  if (!apiKey || !fromEmail) {
    console.warn('Email credentials are missing. Email delivery is disabled.');
    throw new Error('Email service is not configured.');
  }

  try {
    console.log(`Sending email from: ${fromEmail} to: ${to} subject: ${subject}`);

    // Use Elastic Email HTTP REST API (compatible with Cloudflare Workers)
    const params = new URLSearchParams({
      apikey: apiKey,
      from: fromEmail,
      fromName: 'Khyber Shawls',
      to: to,
      subject: subject,
      bodyHtml: html,
      isTransactional: 'true',
    });

    if (replyTo) {
      params.append('replyTo', replyTo);
    }

    const response = await fetch(ELASTIC_EMAIL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const result = await response.text();

    if (!response.ok) {
      throw new Error(`Elastic Email API error: ${response.status} ${result}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { success: response.ok, data: result };
    }

    if (parsed.success === false) {
      throw new Error(`Email send failed: ${parsed.error || result}`);
    }

    console.log('Email sent successfully:', parsed);
    return parsed;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

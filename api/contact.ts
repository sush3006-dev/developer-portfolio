import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load env at module-import time so the values are available immediately.
// We also re-load inside processContactSubmission so that Vite HMR restarts
// pick up a freshly written .env.local without needing a full process restart.
function loadEnv() {
  dotenv.config({ override: false });
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
}
loadEnv();

// Simple in-memory rate limiter for dev / single-instance deployments
// (For distributed serverless clusters in production, Upstash Redis or Cloudflare KV is recommended)
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up stale rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000).unref?.();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return true;
  }

  if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// HTML escape helper to prevent injection attacks in HTML emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  _gotcha?: string; // Honeypot field
}

export interface ContactResult {
  status: number;
  data: {
    success: boolean;
    message: string;
    details?: string;
  };
}

export async function processContactSubmission(
  payload: ContactPayload,
  clientIp: string = 'unknown'
): Promise<ContactResult> {
  // Always refresh environment variables from .env.local to pick up any changes
  loadEnv();

  // 1. Honeypot spam check (bots will fill hidden fields)
  if (payload._gotcha && payload._gotcha.trim().length > 0) {
    // Return fake success to deceive spambots without sending email
    return {
      status: 200,
      data: {
        success: true,
        message: "Message sent successfully! Thank you for reaching out. I'll get back to you soon.",
      },
    };
  }

  // 2. Rate limiting check
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      data: {
        success: false,
        message: 'Too many requests. Please wait a few minutes before sending another message.',
      },
    };
  }

  // 3. Server-side validation
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name) {
    return {
      status: 400,
      data: { success: false, message: 'Your name is required.' },
    };
  }
  if (name.length < 2 || name.length > 100) {
    return {
      status: 400,
      data: { success: false, message: 'Name must be between 2 and 100 characters.' },
    };
  }

  if (!email) {
    return {
      status: 400,
      data: { success: false, message: 'Your email address is required.' },
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 120) {
    return {
      status: 400,
      data: { success: false, message: 'Please provide a valid email address.' },
    };
  }

  if (!message) {
    return {
      status: 400,
      data: { success: false, message: 'Your message is required.' },
    };
  }
  if (message.length < 5) {
    return {
      status: 400,
      data: { success: false, message: 'Message must be at least 5 characters.' },
    };
  }
  if (message.length > 5000) {
    return {
      status: 400,
      data: { success: false, message: 'Message exceeds the maximum limit of 5,000 characters.' },
    };
  }

  // 4. Check for Resend credentials
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_your_api_key_here' || !apiKey.startsWith('re_')) {
    console.warn('[Contact API] RESEND_API_KEY is not configured or is a placeholder.');
    return {
      status: 503,
      data: {
        success: false,
        message:
          'Email delivery is not yet configured. Please configure your RESEND_API_KEY in .env.local to enable real email dispatch.',
      },
    };
  }

  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'kadamsushant5328@gmail.com';
  // Use verified sender from env, or Resend's default testing sender for onboarding
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

  // 5. Build formatted content
  const submissionDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f8fa; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background-color: #07163F; padding: 24px 32px; border-bottom: 3px solid #D4A500;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New message received through your portfolio</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Direct inquiry via portfolio contact form</p>
    </div>
    
    <div style="padding: 32px;">
      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Visitor Name</p>
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #0f172a;">${escapedName}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Visitor Email</p>
        <p style="margin: 0; font-size: 15px; color: #0284c7;">
          <a href="mailto:${escapedEmail}" style="color: #0284c7; text-decoration: none;">${escapedEmail}</a>
        </p>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Message</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #D4A500; border-radius: 6px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #334155;">
          ${escapedMessage}
        </div>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8;">
        <p style="margin: 0;"><strong>Submission Date:</strong> ${submissionDate} (IST)</p>
        <p style="margin: 4px 0 0 0;"><em>Tip: Click "Reply" in your email client to reply directly to ${escapedName} (${escapedEmail}).</em></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
New message received through your portfolio

Visitor Name: ${name}
Visitor Email: ${email}
Submission Date: ${submissionDate}

Message:
${message}

---
Tip: Click Reply to respond directly to ${name} at ${email}.
  `.trim();

  // 6. Send email via Resend
  try {
    const resend = new Resend(apiKey);

    console.log('[Contact API] Dispatching message via Resend:', {
      from: fromEmail,
      to: receiverEmail,
      visitorName: name,
      replyTo: email,
      messageLength: message.length,
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [receiverEmail],
      replyTo: email, // Validated visitor email address for direct reply
      subject: `New Portfolio Enquiry from ${name}`,
      text: textContent,
      html: htmlContent,
    });

    if (error || !data?.id) {
      const errName = error?.name || 'ResendDeliveryError';
      const errMsg = error?.message || 'No valid email ID was returned by Resend.';
      const statusCode = (error as any)?.statusCode || 502;

      console.error('[Contact API] Resend returned error:', {
        status: statusCode,
        name: errName,
        message: errMsg,
      });

      let clientMessage = errMsg;
      if (
        statusCode === 403 ||
        errMsg.toLowerCase().includes('testing') ||
        errMsg.toLowerCase().includes('only send to') ||
        errMsg.toLowerCase().includes('verified domain')
      ) {
        clientMessage =
          'Resend testing restriction: onboarding@resend.dev can only deliver to the email address registered with your Resend account. To deliver to other email addresses, you must verify a custom domain in your Resend dashboard.';
      }

      return {
        status: statusCode,
        data: {
          success: false,
          message: clientMessage,
        },
      };
    }

    console.log('[Contact API] Resend successfully accepted email. Message ID:', data.id);

    return {
      status: 200,
      data: {
        success: true,
        message: "Message sent successfully! Thank you for reaching out. I'll get back to you soon.",
      },
    };
  } catch (err: any) {
    console.error('[Contact API] Unexpected error sending email:', err);
    return {
      status: 500,
      data: {
        success: false,
        message: 'An unexpected error occurred while delivering your message. Please try again later.',
      },
    };
  }
}

// Node / Express / Vercel Serverless Function entry point
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    return;
  }

  // Parse body if not already parsed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ success: false, message: 'Invalid JSON payload' });
      return;
    }
  }

  const clientIp =
    (req.headers && (req.headers['x-forwarded-for'] as string))?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const result = await processContactSubmission(body || {}, clientIp);
  res.status(result.status).json(result.data);
}


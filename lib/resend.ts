import { Resend } from 'resend';

// Initialize Resend client
const apiKey = process.env.RESEND_API_KEY || '';
export const resend = new Resend(apiKey);

export interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
  cc,
  bcc,
  attachments,
  tags
}: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
      cc,
      bcc,
      attachments,
      tags
    });

    if (error) {
      console.error('Error sending email with Resend:', error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    return { id: data?.id, success: true };
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
}

/**
 * Create a tracking pixel for email open tracking
 */
export function createTrackingPixel(trackingId: string) {
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/track?id=${trackingId}`;
  return `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />`;
}

/**
 * Generate a simple HTML email template with tracking pixel
 */
export function generateEmailTemplate({
  content,
  trackingId,
  signature,
}: {
  content: string;
  trackingId?: string;
  signature?: string;
}) {
  const trackingPixel = trackingId ? createTrackingPixel(trackingId) : '';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email from Barty</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${content}
        ${signature ? `<div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">${signature}</div>` : ''}
        ${trackingPixel}
      </body>
    </html>
  `;
} 
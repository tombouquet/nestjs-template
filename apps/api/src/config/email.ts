import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Creates and configures a nodemailer transporter
 * In development, uses MailPit SMTP server
 */
export function createEmailTransporter(): Transporter {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // MailPit configuration for development
    return nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false, // MailPit doesn't use TLS
      ignoreTLS: true,
    });
  }

  // For production, you would configure real SMTP settings here
  // For now, throw an error if not in development
  throw new Error(
    'Email transporter not configured for production. Please configure SMTP settings.',
  );
}

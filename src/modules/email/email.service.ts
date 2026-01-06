import { Injectable, Logger } from '@nestjs/common';
import type { Transporter, SendMailOptions } from 'nodemailer';
import { createEmailTransporter } from '../../config/email';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.transporter = createEmailTransporter();
  }

  /**
   * Sends an email using the configured transporter
   * @param options Email options including recipient, subject, and content
   */
  async sendEmail(options: SendEmailDto): Promise<void> {
    const { to, subject, text, html } = options;

    // Validate that at least one content type is provided
    if (!text && !html) {
      throw new Error('Either text or html content must be provided');
    }

    try {
      const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@localhost',
        to,
        subject,
        text,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email sent successfully to ${to} with subject ${subject}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send email to ${to}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}

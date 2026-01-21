import { Injectable } from '@nestjs/common';
import type { Transporter, SendMailOptions } from 'nodemailer';
import { createEmailTransporter } from '../../config/email';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailTemplateService } from './email-template.service';
import type { TemplateName, TemplateProps } from './templates';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;

  constructor(
    private readonly emailTemplateService: EmailTemplateService,
    private readonly loggingService: LoggingService,
  ) {}

  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = createEmailTransporter();
    }
    return this.transporter;
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

      await this.getTransporter().sendMail(mailOptions);
      this.loggingService.log(
        `Email sent successfully to ${to} with subject ${subject}`,
        { service: EmailService.name },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.loggingService.error(
        `Failed to send email to ${to}: ${errorMessage}`,
        error instanceof Error ? error : undefined,
        { service: EmailService.name },
      );
      throw error;
    }
  }

  /**
   * Sends an email using a React email template
   * @param templateName The name of the template to use
   * @param props The props to pass to the template component
   * @param options Email options including recipient and subject
   */
  async sendTemplateEmail<T extends TemplateName>(
    templateName: T,
    props: TemplateProps[T],
    options: { to: string; subject: string },
  ): Promise<void> {
    const { to, subject } = options;

    try {
      // Render the template to HTML and text
      const { html, text } = await this.emailTemplateService.renderTemplate(
        templateName,
        props,
      );

      // Send using the existing sendEmail method
      await this.sendEmail({
        to,
        subject,
        html,
        text,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.loggingService.error(
        `Failed to send template email "${templateName}" to ${to}: ${errorMessage}`,
        error instanceof Error ? error : undefined,
        { service: EmailService.name },
      );
      throw error;
    }
  }
}

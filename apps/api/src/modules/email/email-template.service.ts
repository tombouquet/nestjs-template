import { Injectable } from '@nestjs/common';
import { pretty, render, toPlainText } from '@react-email/render';
import {
  getTemplate,
  type TemplateName,
  type TemplateProps,
} from './templates';
import { LoggingService } from '../logging/logging.service';

/**
 * Service for rendering React email templates to HTML and plain text
 */
@Injectable()
export class EmailTemplateService {
  constructor(private readonly loggingService: LoggingService) {}

  /**
   * Renders a React email template to HTML and plain text
   * @param templateName The name of the template to render
   * @param props The props to pass to the template component
   * @returns Object containing rendered HTML and plain text
   */
  async renderTemplate<T extends TemplateName>(
    templateName: T,
    props: TemplateProps[T],
  ): Promise<{ html: string; text: string }> {
    try {
      const TemplateComponent = getTemplate(templateName);

      const html = await pretty(await render(TemplateComponent(props)));
      const text = toPlainText(html);

      this.loggingService.debug(
        `Rendered template "${templateName}" successfully`,
        { service: EmailTemplateService.name },
      );

      return { html, text };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.loggingService.error(
        `Failed to render template "${templateName}": ${errorMessage}`,
        error instanceof Error ? error : undefined,
        { service: EmailTemplateService.name },
      );
      throw new Error(
        `Failed to render template "${templateName}": ${errorMessage}`,
      );
    }
  }

  /**
   * Converts HTML to plain text by stripping tags and decoding entities
   * @param html HTML string to convert
   * @returns Plain text string
   */
  private htmlToPlainText(html: string): string {
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, '');
    // Decode common HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();
    return text;
  }
}

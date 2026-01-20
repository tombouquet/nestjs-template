import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { TestTemplateEmailDto } from './dto/test-template-email.dto';
import type { TemplateProps } from './templates';

/**
 * Controller for email testing endpoints
 * Only available in development mode
 */
@ApiTags('Email Testing')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Test endpoint for sending a direct email (HTML/text)
   * Only available in development mode
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a test email (development only)',
    description:
      'Sends a test email with custom HTML/text content. Only available in development mode.',
  })
  @ApiResponse({
    status: 200,
    description: 'Test email sent successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Endpoint only available in development mode',
  })
  async testEmail(@Body() sendEmailDto: SendEmailDto): Promise<{
    message: string;
    to: string;
    subject: string;
  }> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        'Test email endpoint is only available in development mode',
      );
    }

    await this.emailService.sendEmail(sendEmailDto);

    return {
      message: 'Test email sent successfully',
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
    };
  }

  /**
   * Test endpoint for sending a template-based email
   * Only available in development mode
   */
  @Post('test/template')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a test template email (development only)',
    description:
      'Sends a test email using a React email template. Only available in development mode.',
  })
  @ApiResponse({
    status: 200,
    description: 'Test template email sent successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Endpoint only available in development mode',
  })
  async testTemplateEmail(@Body() testDto: TestTemplateEmailDto): Promise<{
    message: string;
    to: string;
    subject: string;
    templateName: string;
  }> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        'Test email endpoint is only available in development mode',
      );
    }

    // Build template props based on template name
    let templateProps: TemplateProps[typeof testDto.templateName];

    if (testDto.templateName === 'welcome') {
      if (!testDto.name || !testDto.email) {
        throw new Error(
          'Welcome template requires "name" and "email" properties',
        );
      }
      templateProps = {
        name: testDto.name,
        email: testDto.email,
      } as TemplateProps['welcome'];
    } else {
      // password-reset template
      if (!testDto.name || !testDto.resetLink || !testDto.expiresIn) {
        throw new Error(
          'Password reset template requires "name", "resetLink", and "expiresIn" properties',
        );
      }
      templateProps = {
        name: testDto.name,
        resetLink: testDto.resetLink,
        expiresIn: testDto.expiresIn,
      } as TemplateProps['password-reset'];
    }

    await this.emailService.sendTemplateEmail(
      testDto.templateName,
      templateProps,
      {
        to: testDto.to,
        subject: testDto.subject,
      },
    );

    return {
      message: 'Test template email sent successfully',
      to: testDto.to,
      subject: testDto.subject,
      templateName: testDto.templateName,
    };
  }
}

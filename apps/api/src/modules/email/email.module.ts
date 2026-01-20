import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import { EmailController } from './email.controller';
import { UnimplementedEmailService } from './unimplemented-email.service';

@Module({
  controllers:
    process.env.NODE_ENV === 'production' ? [] : [EmailController],
  providers:
    process.env.NODE_ENV === 'production'
      ? [
          EmailTemplateService,
          {
            provide: EmailService,
            useClass: UnimplementedEmailService,
          },
        ]
      : [EmailTemplateService, EmailService],
  exports: [EmailService, EmailTemplateService],
})
export class EmailModule {}

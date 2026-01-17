import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UnimplementedEmailService } from './unimplemented-email.service';

@Module({
  providers:
    process.env.NODE_ENV === 'production'
      ? [
          {
            provide: EmailService,
            useClass: UnimplementedEmailService,
          },
        ]
      : [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

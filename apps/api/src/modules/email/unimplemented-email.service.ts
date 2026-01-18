import { Injectable, NotImplementedException } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class UnimplementedEmailService {
  private readonly message =
    'Email module is not implemented in production yet.';

  private unimplemented(): never {
    throw new NotImplementedException(this.message);
  }

  sendEmail(_options: SendEmailDto): Promise<void> {
    void _options;
    return this.unimplemented();
  }
}

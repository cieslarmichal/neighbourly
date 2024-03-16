import { type SendGridService } from '../../../../libs/sendGrid/services/sendGridService/sendGridService.js';
import { type Email } from '../../application/services/emailService/email/email.js';
import { type EmailService } from '../../application/services/emailService/emailService.js';

export class EmailServiceImpl implements EmailService {
  public constructor(private readonly sendGridService: SendGridService) {}

  public sendEmail(email: Email): Promise<void> {
    return this.sendGridService.sendEmail({
      toEmail: email.getRecipient(),
      subject: email.getSubject(),
      body: email.getBody(),
    });
  }
}

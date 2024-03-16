import { type Email } from './email/email.js';

export interface EmailService {
  sendEmail(email: Email): Promise<void>;
}

export interface SendEmailPayload {
  readonly toEmail: string;
  readonly subject: string;
  readonly body: string;
}

export interface SendGridService {
  sendEmail(email: SendEmailPayload): Promise<void>;
}

import { readFileSync } from 'fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Email } from '../services/emailService/email/email.js';

export interface ResetPasswordEmailTemplateData {
  readonly name: string;
  readonly resetPasswordLink: string;
}

export interface ResetPasswordEmailDraft {
  readonly recipient: string;
  readonly templateData: ResetPasswordEmailTemplateData;
}

export class ResetPasswordEmail extends Email {
  protected subject = 'Reset hasła';

  private bodyTemplateData: ResetPasswordEmailTemplateData;

  public constructor(draft: ResetPasswordEmailDraft) {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));

    const bodyTemplate = readFileSync(path.join(currentDirectory, './templates/resetPasswordEmail.html'), 'utf-8');

    super(draft.recipient, bodyTemplate);

    this.bodyTemplateData = draft.templateData;
  }

  public getBody(): string {
    return this.renderBody(this.bodyTemplateData as unknown as Record<string, string>);
  }
}

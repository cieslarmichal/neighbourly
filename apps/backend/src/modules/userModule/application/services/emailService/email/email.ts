export abstract class Email {
  protected abstract subject: string;

  public constructor(
    private readonly recipient: string,
    private readonly bodyTemplate: string,
  ) {}

  public getRecipient(): string {
    return this.recipient;
  }

  public getSubject(): string {
    return this.subject;
  }

  protected renderBody(data: Record<string, string>): string {
    let result = this.bodyTemplate;

    for (const [key, value] of Object.entries(data)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return result;
  }

  public abstract getBody(): string;
}

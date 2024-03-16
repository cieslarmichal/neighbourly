export interface BaseEmailPayload {
  recipientEmail: string;
  name: string;
  [key: string]: unknown;
}

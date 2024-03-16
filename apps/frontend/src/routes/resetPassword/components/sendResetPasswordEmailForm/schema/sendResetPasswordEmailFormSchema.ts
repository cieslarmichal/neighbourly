import { z } from 'zod';

export const sendResetPasswordEmailFormSchema = z.object({
  email: z.string({
    required_error: 'Wymagane.'
  }).email({
    message: 'Niewłaściwy adres email.'
  }),
});

export type SendResetPasswordEmailFormSchemaValues = z.infer<typeof sendResetPasswordEmailFormSchema>;

import { z } from 'zod';

export const setNewPasswordFormSchema = z
  .object({
    password: z.string({
      required_error: 'Wymagane.',
      invalid_type_error: 'Niewłaściwy typ.',
    }).min(8, 'Hasło jest za krótkie.').max(64, 'Hasło jest za długie.'),
    repeatedPassword: z.string({
      required_error: 'Wymagane.',
      invalid_type_error: 'Niewłaściwy typ.',
    }),
  })
  .superRefine(({ repeatedPassword, password }, context) => {
    if (repeatedPassword !== password) {
      context.addIssue({
        code: 'custom',
        message: 'Hasła nie są identyczne.',
        path: ['repeatedPassword'],
      });
    }
  });

export type SetNewPasswordFormSchemaValues = z.infer<typeof setNewPasswordFormSchema>;

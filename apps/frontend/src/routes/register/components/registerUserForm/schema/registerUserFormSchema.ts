import { z } from 'zod';

export const registerUserFormSchema = z
  .object({
    firstName: z
      .string({
        required_error: 'Wymagane.',
      })
      .min(2, 'Imię musi mieć minimum 2 znaki.')
      .max(64, 'Imię może mieć maksymalnie 64 znaki.'),
    email: z
      .string({
        required_error: 'Wymagane.',
      })
      .email({
        message: 'Niewłaściwy adres email.',
      }),
    password: z
      .string({
        required_error: 'Wymagane.',
      })
      .min(8, 'Hasło musi mieć minimum 8 znaków.')
      .max(64, 'Hasło może mieć maksymalnie 64 znaki.'),
    repeatedPassword: z.string({
      required_error: 'Wymagane.',
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

export type RegisterUserFormSchemaValues = z.infer<typeof registerUserFormSchema>;

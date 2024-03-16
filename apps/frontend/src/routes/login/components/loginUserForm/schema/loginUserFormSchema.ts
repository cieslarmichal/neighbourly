import { z } from 'zod';

export const loginUserFormSchema = z.object({
  email: z
    .string({
      required_error: 'Wymagane.',
      invalid_type_error: 'Niewłaściwy typ.'
    })
    .email({
      message: 'Niewłaściwy adres email.'
    }),
  password: z
    .string({
      required_error: 'Wymagane.',
      invalid_type_error: 'Niewłaściwy typ.'
    })
    .min(8, 'Hasło musi mieć co najmniej 8 znaków.')
    .max(64, 'Hasło może mieć co najwyżej 64 znaki.'),
});

export type LoginUserFormValues = z.infer<typeof loginUserFormSchema>;

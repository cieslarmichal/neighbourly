import { z } from 'zod';

export const addressFormSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
});

export type AddressFormSchemaValues = z.infer<typeof addressFormSchema>;
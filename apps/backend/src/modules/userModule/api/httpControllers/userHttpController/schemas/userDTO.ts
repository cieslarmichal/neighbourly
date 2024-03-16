import { type Static, Type } from '@sinclair/typebox';

export const userDTOSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  name: Type.String(),
  isEmailVerified: Type.Boolean(),
});

export type UserDTO = Static<typeof userDTOSchema>;

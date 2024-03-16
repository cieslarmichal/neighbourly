import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const loginUserBodyDTOSchema = Type.Object({
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 64,
  }),
});

export type LoginUserBodyDTO = TypeExtends<Static<typeof loginUserBodyDTOSchema>, contracts.LoginUserRequestBody>;

export const loginUserResponseBodyDTOSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresIn: Type.Number(),
});

export type LoginUserResponseBodyDTO = TypeExtends<
  Static<typeof loginUserResponseBodyDTOSchema>,
  contracts.LoginUserResponseBody
>;

import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const verifyUserBodyDTOSchema = Type.Object({
  token: Type.String({ minLength: 1 }),
});

export type VerifyUserBodyDTO = TypeExtends<Static<typeof verifyUserBodyDTOSchema>, contracts.VerifyUserRequestBody>;

export const verifyUserResponseBodyDTOSchema = Type.Null();

export type VerifyUserResponseBodyDTO = Static<typeof verifyUserResponseBodyDTOSchema>;

import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const resetUserPasswordBodyDTOSchema = Type.Object({
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
});

export type ResetUserPasswordBodyDTO = TypeExtends<
  Static<typeof resetUserPasswordBodyDTOSchema>,
  contracts.ResetUserPasswordRequestBody
>;

export const resetUserPasswordResponseBodyDTOSchema = Type.Null();

export type ResetUserPasswordResponseBodyDTO = Static<typeof resetUserPasswordResponseBodyDTOSchema>;

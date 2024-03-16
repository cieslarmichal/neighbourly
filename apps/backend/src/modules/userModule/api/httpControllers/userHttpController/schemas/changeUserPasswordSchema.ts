import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const changeUserPasswordBodyDTOSchema = Type.Object({
  password: Type.String({
    minLength: 8,
    maxLength: 64,
  }),
  token: Type.String({ minLength: 1 }),
});

export type ChangeUserPasswordBodyDTO = TypeExtends<
  Static<typeof changeUserPasswordBodyDTOSchema>,
  contracts.ChangeUserPasswordRequestBody
>;

export const changeUserPasswordResponseBodyDTOSchema = Type.Null();

export type ChangeUserPasswordResponseBodyDTO = Static<typeof changeUserPasswordResponseBodyDTOSchema>;

import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const logoutUserPathParamsDTOSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export type LogoutUserPathParamsDTO = TypeExtends<
  Static<typeof logoutUserPathParamsDTOSchema>,
  contracts.LogoutUserPathParams
>;

export const logoutUserBodyDTOSchema = Type.Object({
  refreshToken: Type.String(),
  accessToken: Type.String(),
});

export type LogoutUserBodyDTO = TypeExtends<Static<typeof logoutUserBodyDTOSchema>, contracts.LogoutUserRequestBody>;

export const logoutUserResponseBodyDTOSchema = Type.Null();

export type LogoutUserResponseBodyDTO = Static<typeof logoutUserResponseBodyDTOSchema>;

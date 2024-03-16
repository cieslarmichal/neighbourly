import { Type, type Static } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const deleteUserGroupPathParamsDTOSchema = Type.Object({
  userId: Type.String({ format: 'uuid' }),
  groupId: Type.String({ format: 'uuid' }),
});

export type DeleteUserGroupPathParamsDTO = TypeExtends<
  Static<typeof deleteUserGroupPathParamsDTOSchema>,
  contracts.DeleteUserGroupPathParams
>;

export const deleteUserGroupResponseBodyDTOSchema = Type.Null();

export type DeleteUserGroupResponseBodyDTO = Static<typeof deleteUserGroupResponseBodyDTOSchema>;

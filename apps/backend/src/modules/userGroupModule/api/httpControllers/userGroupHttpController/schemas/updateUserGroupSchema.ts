import { type Static, Type } from '@sinclair/typebox';

import * as contracts from '@common/contracts';

import { userGroupDTOSchema } from './userGroupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const updateUserGroupPathParamsDTOSchema = Type.Object({
  userId: Type.String({ format: 'uuid' }),
  groupId: Type.String({ format: 'uuid' }),
});

export type UpdateUserGroupPathParamsDTO = TypeExtends<
  Static<typeof updateUserGroupPathParamsDTOSchema>,
  contracts.UpdateUserGroupPathParams
>;

export const updateUserGroupBodyDTOSchema = Type.Object({
  role: Type.Enum(contracts.UserGroupRole),
});

export type UpdateUserGroupBodyDTO = TypeExtends<
  Static<typeof updateUserGroupBodyDTOSchema>,
  contracts.UpdateUserGroupRequestBody
>;

export const updateUserGroupResponseDTOSchema = userGroupDTOSchema;

export type UpdateUserGroupResponseDTOSchema = TypeExtends<
  Static<typeof updateUserGroupResponseDTOSchema>,
  contracts.UpdateUserGroupResponseBody
>;

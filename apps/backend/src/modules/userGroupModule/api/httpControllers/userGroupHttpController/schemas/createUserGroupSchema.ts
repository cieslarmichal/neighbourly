import { type Static, Type } from '@sinclair/typebox';

import * as contracts from '@common/contracts';

import { userGroupDTOSchema } from './userGroupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const createUserGroupPathParamsDTOSchema = Type.Object({
  userId: Type.String({ format: 'uuid' }),
  groupId: Type.String({ format: 'uuid' }),
});

export type CreateUserGroupPathParamsDTO = TypeExtends<
  Static<typeof createUserGroupPathParamsDTOSchema>,
  contracts.CreateUserGroupPathParams
>;

export const createUserGroupBodyDTOSchema = Type.Object({
  role: Type.Enum(contracts.UserGroupRole),
});

export type CreateUserGroupBodyDTO = TypeExtends<
  Static<typeof createUserGroupBodyDTOSchema>,
  contracts.CreateUserGroupRequestBody
>;

export const createUserGroupResponseBodyDTOSchema = userGroupDTOSchema;

export type CreateUserGroupResponseBodyDTO = TypeExtends<
  Static<typeof createUserGroupResponseBodyDTOSchema>,
  contracts.CreateUserGroupResponseBody
>;

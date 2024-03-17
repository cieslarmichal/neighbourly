import { type Static, Type } from '@sinclair/typebox';

import * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const updateGroupPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type UpdateGroupPathParamsDTO = TypeExtends<
  contracts.UpdateGroupPathParams,
  Static<typeof updateGroupPathParamsDTOSchema>
>;

export const updateGroupBodyDTOSchema = Type.Object({
  name: Type.Optional(
    Type.String({
      minLength: 1,
      maxLength: 64,
    }),
  ),
  accessType: Type.Optional(Type.Enum(contracts.AccessType)),
});

export type UpdateGroupBodyDTO = TypeExtends<contracts.UpdateGroupRequestBody, Static<typeof updateGroupBodyDTOSchema>>;

export const updateGroupResponseBodyDTOSchema = groupDTO;

export type UpdateGroupResponseBodyDTO = TypeExtends<
  contracts.UpdateGroupResponseBody,
  Static<typeof updateGroupResponseBodyDTOSchema>
>;

import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const updateGroupNamePathParamsDTOSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export type UpdateGroupNamePathParamsDTO = TypeExtends<
  contracts.UpdateGroupNamePathParams,
  Static<typeof updateGroupNamePathParamsDTOSchema>
>;

export const updateGroupNameBodyDTOSchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 64,
  }),
});

export type UpdateGroupNameBodyDTO = TypeExtends<
  contracts.UpdateGroupNameRequestBody,
  Static<typeof updateGroupNameBodyDTOSchema>
>;

export const updateGroupNameResponseBodyDTOSchema = groupDTO;

export type UpdateGroupNameResponseBodyDTO = TypeExtends<
  contracts.UpdateGroupNameResponseBody,
  Static<typeof updateGroupNameResponseBodyDTOSchema>
>;

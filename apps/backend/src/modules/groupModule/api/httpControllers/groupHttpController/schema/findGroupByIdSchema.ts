import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findGroupByIdPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type FindGroupByIdPathParamsDTO = TypeExtends<
  contracts.FindGroupByIdPathParams,
  Static<typeof findGroupByIdPathParamsDTOSchema>
>;

export const findGroupByIdResponseBodyDTOSchema = groupDTO;

export type FindGroupByIdResponseBodyDTO = TypeExtends<
  contracts.FindGroupByIdResponseBody,
  Static<typeof findGroupByIdResponseBodyDTOSchema>
>;

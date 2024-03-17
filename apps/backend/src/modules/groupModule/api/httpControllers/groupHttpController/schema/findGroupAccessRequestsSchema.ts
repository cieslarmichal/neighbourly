import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupAccessRequestDTO } from './groupAccessRequestDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findGroupAccessRequestsPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type FindGroupAccessRequestsPathParamsDTO = TypeExtends<
  contracts.FindGroupAccessRequestsPathParams,
  Static<typeof findGroupAccessRequestsPathParamsDTOSchema>
>;

export const findGroupAccessRequestsResponseBodyDTOSchema = Type.Object({
  data: Type.Array(groupAccessRequestDTO),
});

export type FindGroupAccessRequestsResponseBodyDTO = TypeExtends<
  Static<typeof findGroupAccessRequestsResponseBodyDTOSchema>,
  contracts.FindGroupAccessRequestsResponseBody
>;

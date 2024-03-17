import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupAccessRequestDTO } from './groupAccessRequestDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const requestGroupAccessPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type RequestGroupAccessPathParamsDTO = TypeExtends<
  contracts.RequestGroupAccessPathParams,
  Static<typeof requestGroupAccessPathParamsDTOSchema>
>;

export const requestGroupAccessResponseBodyDTOSchema = groupAccessRequestDTO;

export type RequestGroupAccessResponseBodyDTO = TypeExtends<
  contracts.RequestGroupAccessResponseBody,
  Static<typeof requestGroupAccessResponseBodyDTOSchema>
>;

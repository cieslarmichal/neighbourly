import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const searchGroupsQueryParamsDTOSchema = Type.Object({
  latitude: Type.Number({
    minimum: -90,
    maximum: 90,
  }),
  longitude: Type.Number({
    minimum: -180,
    maximum: 180,
  }),
  radius: Type.Number({
    minimum: 0,
    maximum: 5000,
  }),
});

export type SearchGroupsQueryParamsDTO = TypeExtends<
  Static<typeof searchGroupsQueryParamsDTOSchema>,
  contracts.SearchGroupQueryParams
>;

export const searchGroupsOkResponseBodyDTOSchema = Type.Object({
  data: Type.Array(groupDTO),
});

export type SearchGroupsOkResponseBodyDTO = TypeExtends<
  Static<typeof searchGroupsOkResponseBodyDTOSchema>,
  contracts.SearchGroupResponse
>;

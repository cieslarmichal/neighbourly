import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findGroupByNameQueryParamsDTOSchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 64,
  }),
});

export type FindGroupByNameQueryParamsDTO = TypeExtends<
  contracts.FindGroupByNameQueryParams,
  Static<typeof findGroupByNameQueryParamsDTOSchema>
>;

export const findGroupByNameResponseBodyDTOSchema = groupDTO;

export type FindGroupByNameResponseBodyDTO = TypeExtends<
  contracts.FindGroupByNameResponseBody,
  Static<typeof findGroupByNameResponseBodyDTOSchema>
>;

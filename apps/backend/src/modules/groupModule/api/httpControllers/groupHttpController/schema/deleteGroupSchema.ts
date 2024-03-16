import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const deleteGroupPathParamsDTOSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export type DeleteGroupPathParamsDTO = TypeExtends<
  contracts.DeleteGroupPathParams,
  Static<typeof deleteGroupPathParamsDTOSchema>
>;

export const deleteGroupResponseBodyDTOSchema = Type.Null();

export type DeleteGroupResponseBodyDTO = Static<typeof deleteGroupResponseBodyDTOSchema>;

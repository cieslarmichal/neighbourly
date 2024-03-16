import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const deletePostPathParamsDTOSchema = Type.Object({
  postId: Type.String({ format: 'uuid' }),
});

export type DeletePostPathParamsDTO = TypeExtends<
  contracts.DeletePostPathParams,
  Static<typeof deletePostPathParamsDTOSchema>
>;

export const deletePostResponseBodyDTOSchema = Type.Null();

export type DeletePostResponseBodyDTO = Static<typeof deletePostResponseBodyDTOSchema>;

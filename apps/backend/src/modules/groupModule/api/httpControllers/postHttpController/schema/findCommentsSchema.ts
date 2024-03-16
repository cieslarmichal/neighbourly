import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { commentDTO } from './commentDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findCommentsPathParamsDTOSchema = Type.Object({
  postId: Type.String({ format: 'uuid' }),
});

export type FindCommentsPathParamsDTO = TypeExtends<
  contracts.FindCommentsPathParams,
  Static<typeof findCommentsPathParamsDTOSchema>
>;

export const findCommentsResponseBodyDTOSchema = Type.Object({
  data: Type.Array(commentDTO),
});

export type FindCommentsResponseBodyDTO = TypeExtends<
  Static<typeof findCommentsResponseBodyDTOSchema>,
  contracts.FindCommentsResponseBody
>;

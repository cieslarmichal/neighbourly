import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { commentDTO } from './commentDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const updateCommentPathParamsDTOSchema = Type.Object({
  commentId: Type.String({ format: 'uuid' }),
});

export type UpdateCommentPathParamsDTO = TypeExtends<
  contracts.UpdateCommentPathParams,
  Static<typeof updateCommentPathParamsDTOSchema>
>;

export const updateCommentBodyDTOSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 256,
  }),
});

export type UpdateCommentBodyDTO = TypeExtends<
  contracts.UpdateCommentRequestBody,
  Static<typeof updateCommentBodyDTOSchema>
>;

export const updateCommentResponseBodyDTOSchema = commentDTO;

export type UpdateCommentResponseBodyDTO = TypeExtends<
  contracts.UpdateCommentResponseBody,
  Static<typeof updateCommentResponseBodyDTOSchema>
>;

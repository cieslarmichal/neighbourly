import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { commentDTO } from './commentDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const createCommentPathParamsDTOSchema = Type.Object({
  postId: Type.String({ format: 'uuid' }),
});

export type CreateCommentPathParamsDTO = TypeExtends<
  contracts.CreateCommentPathParams,
  Static<typeof createCommentPathParamsDTOSchema>
>;

export const createCommentBodyDTOSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 256,
  }),
});

export type CreateCommentBodyDTO = TypeExtends<
  contracts.CreateCommentRequestBody,
  Static<typeof createCommentBodyDTOSchema>
>;

export const createCommentResponseBodyDTOSchema = commentDTO;

export type CreateCommentResponseBodyDTO = TypeExtends<
  contracts.CreateCommentResponseBody,
  Static<typeof createCommentResponseBodyDTOSchema>
>;

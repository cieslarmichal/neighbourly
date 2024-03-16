import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const deleteCommentPathParamsDTOSchema = Type.Object({
  commentId: Type.String({ format: 'uuid' }),
});

export type DeleteCommentPathParamsDTO = TypeExtends<
  contracts.DeleteCommentPathParams,
  Static<typeof deleteCommentPathParamsDTOSchema>
>;

export const deleteCommentResponseBodyDTOSchema = Type.Null();

export type DeleteCommentResponseBodyDTO = Static<typeof deleteCommentResponseBodyDTOSchema>;

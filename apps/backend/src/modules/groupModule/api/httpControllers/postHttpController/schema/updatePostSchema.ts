import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { postDTO } from './postDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const updatePostPathParamsDTOSchema = Type.Object({
  postId: Type.String({ format: 'uuid' }),
});

export type UpdatePostPathParamsDTO = TypeExtends<
  contracts.UpdatePostPathParams,
  Static<typeof updatePostPathParamsDTOSchema>
>;

export const updatePostBodyDTOSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 256,
  }),
});

export type UpdatePostBodyDTO = TypeExtends<contracts.UpdatePostRequestBody, Static<typeof updatePostBodyDTOSchema>>;

export const updatePostResponseBodyDTOSchema = postDTO;

export type UpdatePostResponseBodyDTO = TypeExtends<
  contracts.UpdatePostResponseBody,
  Static<typeof updatePostResponseBodyDTOSchema>
>;

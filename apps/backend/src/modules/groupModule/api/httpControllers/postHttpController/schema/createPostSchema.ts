import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { postDTO } from './postDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const createPostPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type CreatePostPathParamsDTO = TypeExtends<
  contracts.CreatePostPathParams,
  Static<typeof createPostPathParamsDTOSchema>
>;

export const createPostBodyDTOSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 256,
  }),
});

export type CreatePostBodyDTO = TypeExtends<contracts.CreatePostRequestBody, Static<typeof createPostBodyDTOSchema>>;

export const createPostResponseBodyDTOSchema = postDTO;

export type CreatePostResponseBodyDTO = TypeExtends<
  contracts.CreatePostResponseBody,
  Static<typeof createPostResponseBodyDTOSchema>
>;

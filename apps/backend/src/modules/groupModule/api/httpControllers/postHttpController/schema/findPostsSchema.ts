import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { postDTO } from './postDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findPostsPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type FindPostsPathParamsDTO = TypeExtends<
  contracts.FindPostsPathParams,
  Static<typeof findPostsPathParamsDTOSchema>
>;

export const findPostsResponseBodyDTOSchema = Type.Object({
  data: Type.Array(postDTO),
});

export type FindPostsResponseBodyDTO = TypeExtends<
  Static<typeof findPostsResponseBodyDTOSchema>,
  contracts.FindPostsResponseBody
>;

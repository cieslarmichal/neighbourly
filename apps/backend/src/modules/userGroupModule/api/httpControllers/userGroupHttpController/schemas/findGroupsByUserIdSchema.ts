import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';
import { groupDTO } from '../../../../../groupModule/api/httpControllers/groupHttpController/schema/groupDTO.js';

export const findGroupsByUserIdPathParamsDTOSchema = Type.Object({
  userId: Type.String({ format: 'uuid' }),
});

export type FindGroupsByUserIdPathParamsDTO = TypeExtends<
  contracts.FindGroupsByUserIdPathParams,
  Static<typeof findGroupsByUserIdPathParamsDTOSchema>
>;

export const findGroupsByUserfIdResponseBodyDTOSchema = Type.Object({
  data: Type.Array(groupDTO),
});

export type FindGroupsByUserIdResponseBodyDTO = TypeExtends<
  contracts.FindGroupsByUserIdResponseBody,
  Static<typeof findGroupsByUserfIdResponseBodyDTOSchema>
>;

import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';
import { userDTOSchema } from '../../../../../userModule/api/httpControllers/userHttpController/schemas/userDTO.js';

export const findUsersByGroupIdPathParamsDTOSchema = Type.Object({
  groupId: Type.String({ format: 'uuid' }),
});

export type FindUsersByGroupIdPathParamsDTO = TypeExtends<
  contracts.FindUsersByGroupIdPathParams,
  Static<typeof findUsersByGroupIdPathParamsDTOSchema>
>;

export const findUsersByGroupIdResponseBodyDTOSchema = Type.Object({
  data: Type.Array(userDTOSchema),
});

export type FindUsersByGroupIdResponseBodyDTO = TypeExtends<
  contracts.FindUsersByGroupIdResponseBody,
  Static<typeof findUsersByGroupIdResponseBodyDTOSchema>
>;

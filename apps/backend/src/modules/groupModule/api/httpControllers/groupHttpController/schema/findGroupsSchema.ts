import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findGroupsResponseBodyDTOSchema = Type.Object({
  data: Type.Array(groupDTO),
});

export type FindGroupsResponseBodyDTO = TypeExtends<
  Static<typeof findGroupsResponseBodyDTOSchema>,
  contracts.FindGroupsResponseBody
>;

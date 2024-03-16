import { type Static, Type } from '@sinclair/typebox';

import * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const createGroupBodyDTOSchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 64,
  }),
  accessType: Type.Enum(contracts.AccessType),
});

export type CreateGroupBodyDTO = TypeExtends<contracts.CreateGroupRequestBody, Static<typeof createGroupBodyDTOSchema>>;

export const createGroupResponseBodyDTOSchema = groupDTO;

export type CreateGroupResponseBodyDTO = TypeExtends<
  contracts.CreateGroupResponseBody,
  Static<typeof createGroupResponseBodyDTOSchema>
>;

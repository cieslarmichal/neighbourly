import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { groupDTO } from './groupDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const createGroupBodyDTOSchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 64,
  }),
  addressId: Type.String({ format: 'uuid' }),
});

export type CreateGroupBodyDTO = TypeExtends<contracts.CreateGroupRequestBody, Static<typeof createGroupBodyDTOSchema>>;

export const createGroupResponseBodyDTOSchema = groupDTO;

export type CreateGroupResponseBodyDTO = TypeExtends<
  contracts.CreateGroupResponseBody,
  Static<typeof createGroupResponseBodyDTOSchema>
>;

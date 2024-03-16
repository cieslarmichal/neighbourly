import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../../common/types/schemaExtends.js';

export const addressDTOSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
  latitude: Type.Number({
    minimum: -90,
    maximum: 90,
  }),
  longitude: Type.Number({
    minimum: -180,
    maximum: 180,
  }),
  groupId: Type.Optional(
    Type.String({
      format: 'uuid',
    }),
  ),
  userId: Type.Optional(
    Type.String({
      format: 'uuid',
    }),
  ),
});

export type AddressDTO = TypeExtends<Static<typeof addressDTOSchema>, contracts.Address>;

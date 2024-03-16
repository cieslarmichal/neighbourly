import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { addressDTOSchema } from './dtos/addressDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const createAddressBodyDTOSchema = Type.Object({
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
  street: Type.String(),
  city: Type.String(),
  postalCode: Type.String(),
});

export type CreateAddressBodyDTO = TypeExtends<Static<typeof createAddressBodyDTOSchema>, contracts.CreateAddressBody>;

export const createAddressCreatedResponseDTOSchema = addressDTOSchema;

export type CreateAddressBodyCreatedResponseDTO = TypeExtends<
  Static<typeof createAddressCreatedResponseDTOSchema>,
  contracts.CreateAddressCreatedResponseDTO
>;

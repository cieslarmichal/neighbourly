import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { addressDTOSchema } from './dtos/addressDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const updateAddressPathParamsDTOSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
});

export type UpdateAddressPathParamsDTO = TypeExtends<
  Static<typeof updateAddressPathParamsDTOSchema>,
  contracts.UpdateAddressPathParams
>;

export const updateAddressBodyDTOSchema = Type.Object({
  latitude: Type.Optional(
    Type.Number({
      minimum: -90,
      maximum: 90,
    }),
  ),
  longitude: Type.Optional(
    Type.Number({
      minimum: -180,
      maximum: 180,
    }),
  ),
});

export type UpdateAddressBodyDTO = TypeExtends<Static<typeof updateAddressBodyDTOSchema>, contracts.UpdateAddressBody>;

export const updateAddressOkResponseBodyDTOSchema = addressDTOSchema;

export type UpdateAddressOkResponseBodyDTO = TypeExtends<
  Static<typeof updateAddressOkResponseBodyDTOSchema>,
  contracts.UpdateAddressOkResponseBody
>;

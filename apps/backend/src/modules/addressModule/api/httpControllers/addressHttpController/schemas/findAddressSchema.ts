import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { addressDTOSchema } from './dtos/addressDTO.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const findAddressPathParamsDTOSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
});

export type FindAddressPathParamsDTO = TypeExtends<
  Static<typeof findAddressPathParamsDTOSchema>,
  contracts.FindAddressPathParam
>;

export const findAddressOkResponseBodyDTOSchema = addressDTOSchema;

export type FindAddressOkResponseBodyDTO = TypeExtends<
  Static<typeof findAddressOkResponseBodyDTOSchema>,
  contracts.FindAddressOkResponseBodyDTO
>;

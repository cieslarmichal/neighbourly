import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const approveGroupAccessRequestPathParamsDTOSchema = Type.Object({
  requestId: Type.String({ format: 'uuid' }),
});

export type ApproveGroupAccessRequestPathParamsDTO = TypeExtends<
  contracts.ApproveGroupAccessRequestPathParams,
  Static<typeof approveGroupAccessRequestPathParamsDTOSchema>
>;

export const approveGroupAccessRequestResponseBodyDTOSchema = Type.Null();

export type ApproveGroupAccessRequestResponseBodyDTO = Static<typeof approveGroupAccessRequestResponseBodyDTOSchema>;

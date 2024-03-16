import { type Static, Type } from '@sinclair/typebox';

import type * as contracts from '@common/contracts';

import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const sendVerificationEmailBodyDTOSchema = Type.Object({
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
});

export type SendVerificationEmailBodyDTO = TypeExtends<
  Static<typeof sendVerificationEmailBodyDTOSchema>,
  contracts.SendVerificationEmailRequestBody
>;

export const sendVerificationEmailResponseBodyDTOSchema = Type.Null();

export type SendVerificationEmailResponseBodyDTO = Static<typeof sendVerificationEmailResponseBodyDTOSchema>;

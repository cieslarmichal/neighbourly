/* eslint-disable @typescript-eslint/naming-convention */

import { type Static, Type } from '@sinclair/typebox';
import { type FastifyRequest } from 'fastify';

import type * as contracts from '@common/contracts';

import { userDTOSchema } from './userDTO.js';
import { InputNotValidError } from '../../../../../../common/errors/inputNotValidError.js';
import { type TypeExtends } from '../../../../../../common/types/schemaExtends.js';

export const registerUserBodyDTOSchema = Type.Object({
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 64,
  }),
  name: Type.String({
    minLength: 1,
    maxLength: 64,
  }),
});

export type RegisterUserBodyDTO = TypeExtends<Static<typeof registerUserBodyDTOSchema>, contracts.LoginUserRequestBody>;

export const registerUserResponseBodyDTOSchema = userDTOSchema;

export type RegisterUserResponseBodyDTO = TypeExtends<
  Static<typeof registerUserResponseBodyDTOSchema>,
  contracts.RegisterUserResponseBody
>;

export const registerUserBodyPreValidationHook = (request: FastifyRequest<{ Body: RegisterUserBodyDTO }>): void => {
  const { name } = request.body;

  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/g;

  if (specialCharacterRegex.test(name)) {
    throw new InputNotValidError({
      reason: 'body/name must NOT contain special characters',
      value: name,
    });
  }
};

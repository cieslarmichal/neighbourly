import { type User } from './user.js';

export interface RegisterUserRequestBody {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface RegisterUserResponseBody extends User {}

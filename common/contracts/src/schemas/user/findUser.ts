import { type User } from './user.js';

export interface FindUserPathParams {
  readonly id: string;
}

export interface FindUserResponseBody extends User {}

import { type User } from '../user/user.js';

export interface FindUsersByGroupIdPathParams {
  readonly groupId: string;
}

export interface FindUsersByGroupIdResponseBody {
  readonly data: User[];
}

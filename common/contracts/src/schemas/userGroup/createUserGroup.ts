import { type UserGroup } from './userGroup.js';
import { type UserGroupRole } from './userGroupRole.js';

export interface CreateUserGroupPathParams {
  readonly userId: string;
  readonly groupId: string;
}

export interface CreateUserGroupRequestBody {
  readonly role: UserGroupRole;
}

export type CreateUserGroupResponseBody = UserGroup;

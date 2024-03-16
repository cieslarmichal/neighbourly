import { type UserGroup } from './userGroup.js';
import { type UserGroupRole } from './userGroupRole.js';

export interface UpdateUserGroupPathParams {
  readonly userId: string;
  readonly groupId: string;
}

export interface UpdateUserGroupRequestBody {
  readonly role: UserGroupRole;
}

export type UpdateUserGroupResponseBody = UserGroup;

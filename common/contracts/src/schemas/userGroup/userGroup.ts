import { type UserGroupRole } from './userGroupRole.js';

export interface UserGroup {
  readonly id: string;
  readonly userId: string;
  readonly groupId: string;
  readonly role: UserGroupRole;
}

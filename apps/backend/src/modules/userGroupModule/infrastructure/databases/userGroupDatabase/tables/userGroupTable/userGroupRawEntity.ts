import { type UserGroupRole } from '@common/contracts';

export interface UserGroupRawEntity {
  readonly id: string;
  readonly userId: string;
  readonly groupId: string;
  readonly role: UserGroupRole;
}

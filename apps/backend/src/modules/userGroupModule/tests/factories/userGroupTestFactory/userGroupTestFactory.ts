import { type UserGroupRole } from '@common/contracts';
import { Generator } from '@common/tests';

import { UserGroup, type UserGroupDraft } from '../../../domain/entities/userGroup/userGroup.js';
import { type UserGroupRawEntity } from '../../../infrastructure/databases/userGroupDatabase/tables/userGroupTable/userGroupRawEntity.js';

export class UserGroupTestFactory {
  public create(input: Partial<UserGroupDraft> = {}): UserGroup {
    return new UserGroup({
      id: Generator.uuid(),
      userId: Generator.uuid(),
      groupId: Generator.uuid(),
      role: Generator.userGroupRole() as UserGroupRole,
      ...input,
    });
  }

  public createRaw(input: Partial<UserGroupRawEntity> = {}): UserGroupRawEntity {
    return {
      id: Generator.uuid(),
      userId: Generator.uuid(),
      groupId: Generator.uuid(),
      role: Generator.userGroupRole() as UserGroupRole,
      ...input,
    };
  }
}

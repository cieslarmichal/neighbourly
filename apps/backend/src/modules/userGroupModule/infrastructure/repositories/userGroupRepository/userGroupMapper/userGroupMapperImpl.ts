import { type UserGroupMapper } from './userGroupMapper.js';
import { UserGroup } from '../../../../domain/entities/userGroup/userGroup.js';
import { type UserGroupRawEntity } from '../../../databases/userGroupDatabase/tables/userGroupTable/userGroupRawEntity.js';

export class UserGroupMapperImpl implements UserGroupMapper {
  public mapRawToDomain(entity: UserGroupRawEntity): UserGroup {
    const { id, userId, groupId, role } = entity;

    return new UserGroup({
      id,
      userId,
      groupId,
      role,
    });
  }
}

import { type UserGroup } from '../../../../domain/entities/userGroup/userGroup.js';
import { type UserGroupRawEntity } from '../../../databases/userGroupDatabase/tables/userGroupTable/userGroupRawEntity.js';

export interface UserGroupMapper {
  mapRawToDomain(rawEntity: UserGroupRawEntity): UserGroup;
}

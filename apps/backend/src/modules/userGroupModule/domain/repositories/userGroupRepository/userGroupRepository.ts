import { type Group } from '../../../../groupModule/domain/entities/group/group.js';
import { type User } from '../../../../userModule/domain/entities/user/user.js';
import { type UserGroupState, type UserGroup } from '../../../domain/entities/userGroup/userGroup.js';

export interface SaveUserGroupPayload {
  readonly userGroup: UserGroup | UserGroupState;
}

export interface FindUserGroupPayload {
  readonly userId: string;
  readonly groupId: string;
}

export interface FindUsersPayload {
  readonly groupId: string;
}

export interface FindGroupsPayload {
  readonly userId: string;
}

export interface DeleteUserGroupPayload {
  readonly userId: string;
  readonly groupId: string;
}

export interface UserGroupRepository {
  saveUserGroup(input: SaveUserGroupPayload): Promise<UserGroup>;
  findUserGroup(input: FindUserGroupPayload): Promise<UserGroup | null>;
  findGroups(input: FindGroupsPayload): Promise<Group[]>;
  findUsers(input: FindUsersPayload): Promise<User[]>;
  deleteUserGroup(input: DeleteUserGroupPayload): Promise<void>;
}

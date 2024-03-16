import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { type UserGroupRole } from '@common/contracts';
import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type GroupTestUtils } from '../../../../groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { type UserGroupRepository } from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';
import { symbols } from '../../../symbols.js';
import { UserGroupTestFactory } from '../../../tests/factories/userGroupTestFactory/userGroupTestFactory.js';
import { type UserGroupTestUtils } from '../../../tests/utils/userGroupTestUtils/userGroupTestUtils.js';

describe('UserGroupRepositoryImpl', () => {
  let userGroupRepository: UserGroupRepository;

  let databaseClient: DatabaseClient;

  let userGroupTestUtils: UserGroupTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  const userGroupTestFactory = new UserGroupTestFactory();

  beforeEach(async () => {
    const container = TestContainer.create();

    userGroupRepository = container.get<UserGroupRepository>(symbols.userGroupRepository);

    databaseClient = container.get<DatabaseClient>(coreSymbols.databaseClient);

    userGroupTestUtils = container.get<UserGroupTestUtils>(testSymbols.userGroupTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  afterEach(async () => {
    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('saveUserGroup', () => {
    it('creates UserGroup', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const createdUserGroup = userGroupTestFactory.create({
        groupId: group.id,
        userId: user.id,
      });

      const userGroup = await userGroupRepository.saveUserGroup({
        userGroup: {
          userId: createdUserGroup.getUserId(),
          groupId: createdUserGroup.getGroupId(),
          role: createdUserGroup.getRole(),
        },
      });

      const foundUserGroup = await userGroupTestUtils.findByUserAndGroup({
        userId: user.id,
        groupId: group.id,
      });

      expect(foundUserGroup.id).toEqual(userGroup.getId());

      expect(foundUserGroup.userId).toEqual(user.id);

      expect(foundUserGroup.groupId).toEqual(group.id);

      expect(foundUserGroup.role).toEqual(createdUserGroup.getRole());
    });

    it('updates UserGroup role', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const userGroupRawEntity = await userGroupTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const userGroup = userGroupTestFactory.create(userGroupRawEntity);

      const newRole = Generator.userGroupRole() as UserGroupRole;

      userGroup.setRole({ role: newRole });

      const updatedUserGroup = await userGroupRepository.saveUserGroup({
        userGroup,
      });

      const foundUserGroup = await userGroupTestUtils.findById({
        id: userGroup.getId(),
      });

      expect(updatedUserGroup.getRole()).toEqual(newRole);

      expect(foundUserGroup.role).toEqual(newRole);
    });
  });

  describe('findUserGroups', () => {
    it('returns groups by user id', async () => {
      const user1 = await userTestUtils.createAndPersist();

      const user2 = await userTestUtils.createAndPersist();

      const group1 = await groupTestUtils.createAndPersist();

      const group2 = await groupTestUtils.createAndPersist();

      await userGroupTestUtils.createAndPersist({
        input: {
          userId: user1.id,
          groupId: group1.id,
        },
      });

      await userGroupTestUtils.createAndPersist({
        input: {
          userId: user2.id,
          groupId: group2.id,
        },
      });

      const groups = await userGroupRepository.findGroups({ userId: user1.id });

      expect(groups.length).toEqual(1);

      expect(groups[0]?.getId()).toEqual(group1.id);
    });

    it('returns users by group id', async () => {
      const user1 = await userTestUtils.createAndPersist();

      const user2 = await userTestUtils.createAndPersist();

      const group1 = await groupTestUtils.createAndPersist();

      const group2 = await groupTestUtils.createAndPersist();

      await userGroupTestUtils.createAndPersist({
        input: {
          userId: user1.id,
          groupId: group1.id,
        },
      });

      await userGroupTestUtils.createAndPersist({
        input: {
          userId: user2.id,
          groupId: group2.id,
        },
      });

      const users = await userGroupRepository.findUsers({ groupId: group1.id });

      expect(users.length).toEqual(1);

      expect(users[0]?.getId()).toEqual(user1.id);
    });
  });

  describe('delete', () => {
    it('deletes UserGroup', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const userGroup = await userGroupTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      await userGroupRepository.deleteUserGroup({
        userId: user.id,
        groupId: group.id,
      });

      const foundUserGroup = await userGroupTestUtils.findById({ id: userGroup.id });

      expect(foundUserGroup).toBeUndefined();
    });

    it('throws an error if UserGroup with given id does not exist', async () => {
      const userId = Generator.uuid();

      const groupId = Generator.uuid();

      await expect(
        async () =>
          await userGroupRepository.deleteUserGroup({
            userId,
            groupId,
          }),
      ).toThrowErrorInstance({
        instance: ResourceNotFoundError,
        context: {
          name: 'UserGroup',
          userId,
          groupId,
        },
      });
    });
  });
});

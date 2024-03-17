import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { GroupAccessRequest } from '../../../domain/entities/groupAccessRequest/groupAccessRequest.js';
import { type GroupAccessRequestRepository } from '../../../domain/repositories/groupAccessRequestRepository/groupAccessRequestRepository.js';
import { symbols } from '../../../symbols.js';
import { type GroupAccessRequestTestUtils } from '../../../tests/utils/groupAccessRequestTestUtils/groupAccessRequestTestUtils.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('GroupAccessRequestRepositoryImpl', () => {
  let groupAccessRequestRepository: GroupAccessRequestRepository;

  let groupAccessRequestTestUtils: GroupAccessRequestTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    groupAccessRequestRepository = container.get<GroupAccessRequestRepository>(symbols.groupAccessRequestRepository);

    groupAccessRequestTestUtils = container.get<GroupAccessRequestTestUtils>(testSymbols.groupAccessRequestTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    await groupAccessRequestTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  afterEach(async () => {
    await groupAccessRequestTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  describe('findById', () => {
    it('returns null - when GroupAccessRequest was not found', async () => {
      const res = await groupAccessRequestRepository.findGroupAccessRequest({ id: Generator.uuid() });

      expect(res).toBeNull();
    });

    it('returns GroupAccessRequest', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const createdGroupAccessRequest = await groupAccessRequestTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const groupAccessRequest = await groupAccessRequestRepository.findGroupAccessRequest({
        id: createdGroupAccessRequest.id,
      });

      expect(groupAccessRequest?.getId()).toEqual(createdGroupAccessRequest.id);
    });
  });

  describe('findManyByGroup', () => {
    it('returns GroupAccessRequests', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      await groupAccessRequestTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const groupAccessRequests = await groupAccessRequestRepository.findGroupAccessRequests({ groupId: group.id });

      expect(groupAccessRequests.length).toBe(1);

      expect(groupAccessRequests[0]?.getGroupId()).toBe(group.id);
    });
  });

  describe('Save', () => {
    it('creates GroupAccessRequest', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const groupAccessRequest = await groupAccessRequestRepository.saveGroupAccessRequest({
        groupAccessRequest: {
          userId: user.id,
          groupId: group.id,
        },
      });

      expect(groupAccessRequest).toBeInstanceOf(GroupAccessRequest);

      expect(groupAccessRequest.getState()).toEqual({
        userId: user.id,
        groupId: group.id,
      });

      const foundGroupAccessRequest = await groupAccessRequestTestUtils.findById(groupAccessRequest.getId());

      expect(foundGroupAccessRequest).toBeDefined();
    });
  });

  describe('delete', () => {
    it('deletes GroupAccessRequest', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const createdGroupAccessRequest = await groupAccessRequestTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      await groupAccessRequestRepository.deleteGroupAccessRequest({ id: createdGroupAccessRequest.id });

      const deletedGroupAccessRequest = await groupAccessRequestTestUtils.findById(createdGroupAccessRequest.id);

      expect(deletedGroupAccessRequest).toBeNull();
    });
  });
});

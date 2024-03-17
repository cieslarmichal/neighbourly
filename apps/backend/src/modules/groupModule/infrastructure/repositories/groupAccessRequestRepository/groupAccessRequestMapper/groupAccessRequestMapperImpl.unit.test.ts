import { beforeEach, expect, describe, it } from 'vitest';

import { GroupAccessRequestMapperImpl } from './groupAccessRequestMapperImpl.js';
import { GroupAccessRequestTestFactory } from '../../../../tests/factories/groupAccessRequestTestFactory/groupAccessRequestTestFactory.js';

describe('GroupAccessRequestMapperImpl', () => {
  let groupAccessRequestMapperImpl: GroupAccessRequestMapperImpl;

  const groupAccessRequestTestFactory = new GroupAccessRequestTestFactory();

  beforeEach(async () => {
    groupAccessRequestMapperImpl = new GroupAccessRequestMapperImpl();
  });

  it('maps from GroupAccessRequestRawEntity to GroupAccessRequest', async () => {
    const groupAccessRequestEntity = groupAccessRequestTestFactory.createRaw();

    const groupAccessRequest = groupAccessRequestMapperImpl.mapToDomain(groupAccessRequestEntity);

    expect(groupAccessRequest).toEqual({
      id: groupAccessRequestEntity.id,
      createdAt: groupAccessRequestEntity.createdAt,
      state: {
        userId: groupAccessRequestEntity.userId,
        groupId: groupAccessRequestEntity.groupId,
      },
    });
  });

  it('maps from domain GroupAccessRequest to GroupAccessRequestRawEntity', () => {
    const groupAccessRequest = groupAccessRequestTestFactory.create();

    const groupAccessRequestRawEntity = groupAccessRequestMapperImpl.mapToPersistence(groupAccessRequest);

    expect(groupAccessRequestRawEntity).toEqual({
      id: groupAccessRequest.getId(),
      groupId: groupAccessRequest.getGroupId(),
      userId: groupAccessRequest.getUserId(),
      createdAt: groupAccessRequest.getCreatedAt(),
    });
  });
});

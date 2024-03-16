import { beforeEach, expect, describe, it } from 'vitest';

import { UserGroupMapperImpl } from './userGroupMapperImpl.js';
import { UserGroupTestFactory } from '../../../../tests/factories/userGroupTestFactory/userGroupTestFactory.js';

describe('UserGroupMapperImpl', () => {
  let userGroupMapperImpl: UserGroupMapperImpl;

  const userGroupTestFactory = new UserGroupTestFactory();

  beforeEach(async () => {
    userGroupMapperImpl = new UserGroupMapperImpl();
  });

  it('maps from userGroup raw entity to domain userGroup', async () => {
    const userGroupRawEntity = userGroupTestFactory.createRaw();

    const userGroup = userGroupMapperImpl.mapRawToDomain(userGroupRawEntity);

    expect(userGroup).toEqual({
      id: userGroupRawEntity.id,
      state: {
        userId: userGroupRawEntity.userId,
        groupId: userGroupRawEntity.groupId,
        role: userGroupRawEntity.role,
      },
    });
  });
});

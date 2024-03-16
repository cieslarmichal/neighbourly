import { beforeEach, expect, describe, it } from 'vitest';

import { GroupMapperImpl } from './groupMapperImpl.js';
import { GroupTestFactory } from '../../../../tests/factories/groupTestFactory/groupTestFactory.js';

describe('GroupMapperImpl', () => {
  let groupMapperImpl: GroupMapperImpl;

  const groupTestFactory = new GroupTestFactory();

  beforeEach(async () => {
    groupMapperImpl = new GroupMapperImpl();
  });

  it('maps from group raw entity to domain group', async () => {
    const groupEntity = groupTestFactory.createRaw();

    const group = groupMapperImpl.mapToDomain(groupEntity);

    expect(group).toEqual({
      id: groupEntity.id,
      state: {
        name: groupEntity.name,
        accessType: groupEntity.accessType,
      },
    });
  });

  it('maps from domain group to group raw entity', () => {
    const group = groupTestFactory.create();

    const groupRawEntity = groupMapperImpl.mapToPersistence(group);

    expect(groupRawEntity).toEqual({
      id: group.getId(),
      name: group.getName(),
      accessType: group.getAccessType(),
    });
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type AccessType } from '@common/contracts';
import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type AddressTestUtils } from '../../../../addressModule/tests/utils/addressTestUtils/addressTestUtils.js';
import { Group } from '../../../domain/entities/group/group.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';
import { symbols } from '../../../symbols.js';
import { GroupTestFactory } from '../../../tests/factories/groupTestFactory/groupTestFactory.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type GroupRawEntity } from '../../databases/groupDatabase/tables/groupTable/groupRawEntity.js';

describe('GroupRepositoryImpl', () => {
  let groupRepository: GroupRepository;

  let groupTestUtils: GroupTestUtils;

  let addressTestUtils: AddressTestUtils;

  const groupTestFactory = new GroupTestFactory();

  beforeEach(() => {
    const container = TestContainer.create();

    groupRepository = container.get<GroupRepository>(symbols.groupRepository);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    addressTestUtils = container.get<AddressTestUtils>(testSymbols.addressTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await addressTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  describe('findAll', () => {
    it('returns an empty array - given no Groups exist', async () => {
      const res = await groupRepository.findAllGroups();

      expect(res.length).toBe(0);

      expect(res).toBeInstanceOf(Array);
    });

    it('returns all Groups', async () => {
      const createdGroups: GroupRawEntity[] = [];

      for (let i = 0; i < 50; i++) {
        const createdGroup = await groupTestUtils.createAndPersist();

        createdGroups.push(createdGroup);
      }

      const res = await groupRepository.findAllGroups();

      expect(res.length).toBe(createdGroups.length);

      expect(res).toBeInstanceOf(Array);
    });
  });

  describe('findById', () => {
    it('returns null - when Group was not found', async () => {
      const res = await groupRepository.findGroup({ id: 'non-existing-id' });

      expect(res).toBeNull();
    });

    it('returns Group', async () => {
      const createdGroup = await groupTestUtils.createAndPersist();

      const group = await groupRepository.findGroup({ id: createdGroup.id });

      expect(group).toBeInstanceOf(Group);

      expect(group?.getId()).toEqual(createdGroup.id);
    });
  });

  describe('findManyByIds', () => {
    it('returns an empty array - given no Groups found', async () => {
      const nonExistentIds = Array.from({ length: 5 }, () => Generator.uuid());

      const groups = await groupRepository.findGroupsByIds({
        ids: nonExistentIds,
      });

      expect(groups.length).toBe(0);
    });

    it('returns Groups', async () => {
      const group1 = await groupTestUtils.createAndPersist();

      const group2 = await groupTestUtils.createAndPersist();

      const group3 = await groupTestUtils.createAndPersist();

      const group4 = await groupTestUtils.createAndPersist();

      const groups = await groupRepository.findGroupsByIds({
        ids: [group1.id, group2.id, group3.id, group4.id],
      });

      expect(groups.length).toBe(4);
    });
  });

  describe('findGroupsWithinRadius', () => {
    it('returns an empty array - when no Groups were found', async () => {
      const latitude = Generator.number(-90, 90, 6);

      const longitude = Generator.number(-180, 180, 6);

      const radius = Generator.number(1, 10000);

      const groups = await groupRepository.findGroupsWithinRadius({
        latitude,
        longitude,
        radius,
      });

      expect(groups).toEqual([]);
    });

    it('returns groups found within radius', async () => {
      const radius = Generator.number(100, 10000);

      const group1 = await groupTestUtils.createAndPersist();

      const group2 = await groupTestUtils.createAndPersist();

      const group3 = await groupTestUtils.createAndPersist();

      const location = {
        latitude: Generator.number(-90, 90, 6),
        longitude: Generator.number(-180, 180, 6),
      };

      await addressTestUtils.createAndPersist({
        input: {
          state: {
            groupId: group1.id,
            ...Generator.locationNearby({
              latitude: location.latitude,
              longitude: location.longitude,
              radius,
            }),
          },
        },
      });

      await addressTestUtils.createAndPersist({
        input: {
          state: {
            groupId: group2.id,
            ...Generator.locationNearby({
              latitude: location.latitude,
              longitude: location.longitude,
              radius,
            }),
          },
        },
      });

      await addressTestUtils.createAndPersist({
        input: {
          state: {
            groupId: group3.id,
            ...Generator.locationNearby({
              latitude: location.latitude,
              longitude: location.longitude,
              radius,
            }),
          },
        },
      });

      const groups = await groupRepository.findGroupsWithinRadius({
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
      });

      expect(groups.length).toBe(3);
    });
  });

  describe('findByName', () => {
    it('returns null - when Group was not found', async () => {
      const group = await groupRepository.findGroup({
        name: 'non-existing-name',
      });

      expect(group).toBeNull();
    });

    it('returns Group', async () => {
      const group = await groupTestUtils.createAndPersist();

      const result = await groupRepository.findGroup({
        name: group.name,
      });

      expect(result).toBeInstanceOf(Group);

      expect(result?.getName()).toEqual(group.name);
    });
  });

  describe('Save', () => {
    it('creates Group', async () => {
      const name = Generator.word();

      const accessType = Generator.accessType() as AccessType;

      const group = await groupRepository.saveGroup({
        group: {
          name,
          accessType,
        },
      });

      expect(group).toBeInstanceOf(Group);

      expect(group.getName()).toBe(name);

      const createdGroup = await groupTestUtils.findById(group.getId());

      expect(createdGroup?.name).toBe(name);
    });

    it('throws an error while creating - when Group with the same name already exists', async () => {
      const name = Generator.word();

      const accessType = Generator.accessType() as AccessType;

      await groupRepository.saveGroup({
        group: {
          name,
          accessType,
        },
      });

      await expect(
        async () =>
          await groupRepository.saveGroup({
            group: {
              name,
              accessType,
            },
          }),
      ).toThrowErrorInstance({
        instance: RepositoryError,
        context: {
          entity: 'Group',
          operation: 'create',
        },
      });
    });

    it('updates Group', async () => {
      const groupRawEntity = await groupTestUtils.createAndPersist();

      const newName = Generator.words(2);

      const newAccessType = Generator.accessType() as AccessType;

      const group = groupTestFactory.create(groupRawEntity);

      group.setName({ name: newName });

      group.setAccessType({ accessType: newAccessType });

      const upatedGroup = await groupRepository.saveGroup({
        group,
      });

      expect(upatedGroup).toBeInstanceOf(Group);

      expect(upatedGroup.getName()).toBe(newName);

      expect(upatedGroup.getAccessType()).toBe(newAccessType);

      const persistedGroup = await groupTestUtils.findById(groupRawEntity.id);

      expect(persistedGroup).not.toBeNull();

      expect(persistedGroup?.name).toBe(newName);

      expect(persistedGroup?.accessType).toBe(newAccessType);
    });

    it('throws an error while updating - when Group with the same name already exists', async () => {
      const createdGroup1 = await groupTestUtils.createAndPersist();

      const createdGroup2 = await groupTestUtils.createAndPersist();

      await expect(
        async () =>
          await groupRepository.saveGroup({
            group: new Group({
              id: createdGroup1.id,
              name: createdGroup2.name,
              accessType: createdGroup1.accessType,
            }),
          }),
      ).toThrowErrorInstance({
        instance: RepositoryError,
        context: {
          entity: 'Group',
          operation: 'update',
        },
      });
    });
  });

  describe('delete', () => {
    it('deletes Group', async () => {
      const createdGroup = await groupTestUtils.createAndPersist();

      await groupRepository.deleteGroup({ id: createdGroup.id });

      const deletedGroup = await groupTestUtils.findById(createdGroup.id);

      expect(deletedGroup).toBeNull();
    });
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { Group } from '../../../domain/entities/group/group.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';
import { symbols } from '../../../symbols.js';
import { GroupTestFactory } from '../../../tests/factories/groupTestFactory/groupTestFactory.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type GroupRawEntity } from '../../databases/groupDatabase/tables/groupTable/groupRawEntity.js';

describe('GroupRepositoryImpl', () => {
  let groupRepository: GroupRepository;

  let groupTestUtils: GroupTestUtils;

  const groupTestFactory = new GroupTestFactory();

  beforeEach(() => {
    const container = TestContainer.create();

    groupRepository = container.get<GroupRepository>(symbols.groupRepository);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

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

      const addressId = Generator.uuid();

      const group = await groupRepository.saveGroup({
        group: {
          name,
          addressId,
        },
      });

      expect(group).toBeInstanceOf(Group);

      expect(group.getName()).toBe(name);

      const createdGroup = await groupTestUtils.findById(group.getId());

      expect(createdGroup?.name).toBe(name);
    });

    it('throws an error while creating - when Group with the same name already exists', async () => {
      const name = Generator.word();

      const addressId = Generator.uuid();

      await groupRepository.saveGroup({
        group: {
          name,
          addressId,
        },
      });

      await expect(
        async () =>
          await groupRepository.saveGroup({
            group: {
              name,
              addressId,
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

      const group = groupTestFactory.create(groupRawEntity);

      group.setName({ name: newName });

      const upatedGroup = await groupRepository.saveGroup({
        group,
      });

      expect(upatedGroup).toBeInstanceOf(Group);

      expect(upatedGroup.getName()).toBe(newName);

      const persistedGroup = await groupTestUtils.findById(groupRawEntity.id);

      expect(persistedGroup).not.toBeNull();

      expect(persistedGroup?.name).toBe(newName);
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
              addressId: createdGroup2.addressId,
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

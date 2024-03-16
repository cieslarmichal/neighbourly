import { type AccessType } from '@common/contracts';
import { Generator } from '@common/tests';

import { Group, type GroupState } from '../../../domain/entities/group/group.js';
import { type GroupRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/groupTable/groupRawEntity.js';

export class GroupTestFactory {
  public createRaw(overrides: Partial<GroupRawEntity> = {}): GroupRawEntity {
    return {
      id: Generator.uuid(),
      name: Generator.word(),
      accessType: Generator.accessType() as AccessType,
      ...overrides,
    };
  }

  public create(overrides: Partial<GroupState> = {}): Group {
    return new Group({
      id: Generator.uuid(),
      name: Generator.word(),
      accessType: Generator.accessType() as AccessType,
      ...overrides,
    });
  }
}

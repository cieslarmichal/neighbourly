import { Generator } from '@common/tests';

import {
  GroupAccessRequest,
  type GroupAccessRequestState,
} from '../../../domain/entities/groupAccessRequest/groupAccessRequest.js';
import { type GroupAccessRequestRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestRawEntity.js';

export class GroupAccessRequestTestFactory {
  public createRaw(overrides: Partial<GroupAccessRequestRawEntity> = {}): GroupAccessRequestRawEntity {
    return {
      id: Generator.uuid(),
      groupId: Generator.uuid(),
      userId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...overrides,
    };
  }

  public create(overrides: Partial<GroupAccessRequestState> = {}): GroupAccessRequest {
    return new GroupAccessRequest({
      id: Generator.uuid(),
      groupId: Generator.uuid(),
      userId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...overrides,
    });
  }
}

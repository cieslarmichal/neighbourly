import { type GroupAccessRequestMapper } from './groupAccessRequestMapper.js';
import { GroupAccessRequest } from '../../../../domain/entities/groupAccessRequest/groupAccessRequest.js';
import { type GroupAccessRequestRawEntity } from '../../../databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestRawEntity.js';

export class GroupAccessRequestMapperImpl implements GroupAccessRequestMapper {
  public mapToDomain(raw: GroupAccessRequestRawEntity): GroupAccessRequest {
    return new GroupAccessRequest({
      id: raw.id,
      groupId: raw.groupId,
      userId: raw.userId,
      createdAt: raw.createdAt,
    });
  }

  public mapToPersistence(domain: GroupAccessRequest): GroupAccessRequestRawEntity {
    return {
      id: domain.getId(),
      groupId: domain.getGroupId(),
      userId: domain.getUserId(),
      createdAt: domain.getCreatedAt(),
    };
  }
}

import { type GroupAccessRequest } from '../../../../domain/entities/groupAccessRequest/groupAccessRequest.js';
import { type GroupAccessRequestRawEntity } from '../../../databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestRawEntity.js';

export interface GroupAccessRequestMapper {
  mapToDomain(raw: GroupAccessRequestRawEntity): GroupAccessRequest;
  mapToPersistence(domain: GroupAccessRequest): GroupAccessRequestRawEntity;
}

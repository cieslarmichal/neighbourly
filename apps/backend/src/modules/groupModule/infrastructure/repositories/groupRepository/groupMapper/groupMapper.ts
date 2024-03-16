import { type Group } from '../../../../domain/entities/group/group.js';
import { type GroupRawEntity } from '../../../databases/groupDatabase/tables/groupTable/groupRawEntity.js';

export interface GroupMapper {
  mapToDomain(raw: GroupRawEntity): Group;
  mapToPersistence(domain: Group): GroupRawEntity;
}

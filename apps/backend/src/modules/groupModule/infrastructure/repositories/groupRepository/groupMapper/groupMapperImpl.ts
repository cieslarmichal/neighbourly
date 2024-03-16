import { type GroupMapper } from './groupMapper.js';
import { Group } from '../../../../domain/entities/group/group.js';
import { type GroupRawEntity } from '../../../databases/groupDatabase/tables/groupTable/groupRawEntity.js';

export class GroupMapperImpl implements GroupMapper {
  public mapToDomain(raw: GroupRawEntity): Group {
    return new Group({
      id: raw.id,
      name: raw.name,
      accessType: raw.accessType,
    });
  }

  public mapToPersistence(domain: Group): GroupRawEntity {
    return {
      id: domain.getId(),
      name: domain.getName(),
      accessType: domain.getAccessType(),
    };
  }
}

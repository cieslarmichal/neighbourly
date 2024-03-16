import { type PostMapper } from './postMapper.js';
import { Post } from '../../../../domain/entities/post/post.js';
import { type PostRawEntity } from '../../../databases/groupDatabase/tables/postTable/postRawEntity.js';

export class PostMapperImpl implements PostMapper {
  public mapToDomain(raw: PostRawEntity): Post {
    return new Post({
      id: raw.id,
      content: raw.content,
      groupId: raw.groupId,
      userId: raw.userId,
      createdAt: raw.createdAt,
    });
  }

  public mapToPersistence(domain: Post): PostRawEntity {
    return {
      id: domain.getId(),
      content: domain.getContent(),
      groupId: domain.getGroupId(),
      userId: domain.getUserId(),
      createdAt: domain.getCreatedAt(),
    };
  }
}

import { type CommentMapper } from './commentMapper.js';
import { Comment } from '../../../../domain/entities/comment/comment.js';
import { type CommentRawEntity } from '../../../databases/groupDatabase/tables/commentTable/commentRawEntity.js';

export class CommentMapperImpl implements CommentMapper {
  public mapToDomain(raw: CommentRawEntity): Comment {
    return new Comment({
      id: raw.id,
      content: raw.content,
      postId: raw.postId,
      userId: raw.userId,
      createdAt: raw.createdAt,
    });
  }

  public mapToPersistence(domain: Comment): CommentRawEntity {
    return {
      id: domain.getId(),
      content: domain.getContent(),
      postId: domain.getPostId(),
      userId: domain.getUserId(),
      createdAt: domain.getCreatedAt(),
    };
  }
}

import { type Comment } from '../../../../domain/entities/comment/comment.js';
import { type CommentRawEntity } from '../../../databases/groupDatabase/tables/commentTable/commentRawEntity.js';

export interface CommentMapper {
  mapToDomain(raw: CommentRawEntity): Comment;
  mapToPersistence(domain: Comment): CommentRawEntity;
}

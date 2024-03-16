import { type Post } from '../../../../domain/entities/post/post.js';
import { type PostRawEntity } from '../../../databases/groupDatabase/tables/postTable/postRawEntity.js';

export interface PostMapper {
  mapToDomain(raw: PostRawEntity): Post;
  mapToPersistence(domain: Post): PostRawEntity;
}

import { type PostMapper } from './postMapper/postMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { Post, type PostState } from '../../../domain/entities/post/post.js';
import {
  type FindPostPayload,
  type PostRepository,
  type FindPosts,
  type SavePostPayload,
  type DeletePostPayload,
} from '../../../domain/repositories/postRepository/postRepository.js';
import { type PostRawEntity } from '../../databases/groupDatabase/tables/postTable/postRawEntity.js';
import { postTable } from '../../databases/groupDatabase/tables/postTable/postTable.js';

type CreatePostPayload = { post: PostState };

type UpdatePostPayload = { post: Post };

export class PostRepositoryImpl implements PostRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly postMapper: PostMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async findPost(payload: FindPostPayload): Promise<Post | null> {
    const { id } = payload;

    let rawEntity: PostRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<PostRawEntity>(postTable).select('*').where({ id }).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Post',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.postMapper.mapToDomain(rawEntity);
  }

  public async findPosts(payload: FindPosts): Promise<Post[]> {
    const { groupId } = payload;

    let rawEntities: PostRawEntity[];

    try {
      rawEntities = await this.databaseClient<PostRawEntity>(postTable).select('*').where({ groupId });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Post',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.postMapper.mapToDomain(rawEntity));
  }

  public async savePost(payload: SavePostPayload): Promise<Post> {
    const { post } = payload;

    if (post instanceof Post) {
      return this.update({ post });
    }

    return this.create({ post });
  }

  private async create(payload: CreatePostPayload): Promise<Post> {
    const { post } = payload;

    let rawEntities: PostRawEntity[];

    try {
      rawEntities = await this.databaseClient<PostRawEntity>(postTable)
        .insert({
          id: this.uuidService.generateUuid(),
          groupId: post.groupId,
          userId: post.userId,
          content: post.content,
          createdAt: new Date(),
        })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Post',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as PostRawEntity;

    return this.postMapper.mapToDomain(rawEntity);
  }

  private async update(payload: UpdatePostPayload): Promise<Post> {
    const { post } = payload;

    let rawEntities: PostRawEntity[];

    try {
      rawEntities = await this.databaseClient<PostRawEntity>(postTable)
        .update(post.getState())
        .where({ id: post.getId() })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Post',
        operation: 'update',
        error,
      });
    }

    const rawEntity = rawEntities[0] as PostRawEntity;

    return this.postMapper.mapToDomain(rawEntity);
  }

  public async deletePost(payload: DeletePostPayload): Promise<void> {
    const { id } = payload;

    try {
      await this.databaseClient<PostRawEntity>(postTable).delete().where({ id });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Post',
        operation: 'delete',
        error,
      });
    }
  }
}

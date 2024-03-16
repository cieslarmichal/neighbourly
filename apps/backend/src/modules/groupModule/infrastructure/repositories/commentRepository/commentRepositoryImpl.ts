import { type CommentMapper } from './commentMapper/commentMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { Comment, type CommentState } from '../../../domain/entities/comment/comment.js';
import {
  type FindCommentPayload,
  type CommentRepository,
  type FindComments,
  type SaveCommentPayload,
  type DeleteCommentPayload,
} from '../../../domain/repositories/commentRepository/commentRepository.js';
import { type CommentRawEntity } from '../../databases/groupDatabase/tables/commentTable/commentRawEntity.js';
import { commentTable } from '../../databases/groupDatabase/tables/commentTable/commentTable.js';

type CreateCommentPayload = { comment: CommentState };

type UpdateCommentPayload = { comment: Comment };

export class CommentRepositoryImpl implements CommentRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly commentMapper: CommentMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async findComment(payload: FindCommentPayload): Promise<Comment | null> {
    const { id } = payload;

    let rawEntity: CommentRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<CommentRawEntity>(commentTable).select('*').where({ id }).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Comment',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.commentMapper.mapToDomain(rawEntity);
  }

  // TODO: add pagination
  public async findComments(payload: FindComments): Promise<Comment[]> {
    const { postId } = payload;

    let rawEntities: CommentRawEntity[];

    try {
      rawEntities = await this.databaseClient<CommentRawEntity>(commentTable)
        .select('*')
        .where({ postId })
        .orderBy('createdAt', 'desc');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Comment',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.commentMapper.mapToDomain(rawEntity));
  }

  public async saveComment(payload: SaveCommentPayload): Promise<Comment> {
    const { comment } = payload;

    if (comment instanceof Comment) {
      return this.update({ comment });
    }

    return this.create({ comment });
  }

  private async create(payload: CreateCommentPayload): Promise<Comment> {
    const { comment } = payload;

    let rawEntities: CommentRawEntity[];

    try {
      rawEntities = await this.databaseClient<CommentRawEntity>(commentTable)
        .insert({
          id: this.uuidService.generateUuid(),
          postId: comment.postId,
          userId: comment.userId,
          content: comment.content,
          createdAt: new Date(),
        })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Comment',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as CommentRawEntity;

    return this.commentMapper.mapToDomain(rawEntity);
  }

  private async update(payload: UpdateCommentPayload): Promise<Comment> {
    const { comment } = payload;

    let rawEntities: CommentRawEntity[];

    try {
      rawEntities = await this.databaseClient<CommentRawEntity>(commentTable)
        .update(comment.getState())
        .where({ id: comment.getId() })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Comment',
        operation: 'update',
        error,
      });
    }

    const rawEntity = rawEntities[0] as CommentRawEntity;

    return this.commentMapper.mapToDomain(rawEntity);
  }

  public async deleteComment(payload: DeleteCommentPayload): Promise<void> {
    const { id } = payload;

    try {
      await this.databaseClient<CommentRawEntity>(commentTable).delete().where({ id });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Comment',
        operation: 'delete',
        error,
      });
    }
  }
}

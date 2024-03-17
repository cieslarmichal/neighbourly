import { type CommentDTO } from './schema/commentDTO.js';
import {
  createCommentBodyDTOSchema,
  createCommentResponseBodyDTOSchema,
  type CreateCommentBodyDTO,
  type CreateCommentPathParamsDTO,
  type CreateCommentResponseBodyDTO,
} from './schema/createCommentSchema.js';
import {
  createPostBodyDTOSchema,
  createPostResponseBodyDTOSchema,
  type CreatePostBodyDTO,
  type CreatePostResponseBodyDTO,
  type CreatePostPathParamsDTO,
} from './schema/createPostSchema.js';
import {
  deleteCommentPathParamsDTOSchema,
  deleteCommentResponseBodyDTOSchema,
  type DeleteCommentPathParamsDTO,
  type DeleteCommentResponseBodyDTO,
} from './schema/deleteCommentSchema.js';
import {
  deletePostPathParamsDTOSchema,
  deletePostResponseBodyDTOSchema,
  type DeletePostPathParamsDTO,
  type DeletePostResponseBodyDTO,
} from './schema/deletePostSchema.js';
import {
  findCommentsResponseBodyDTOSchema,
  type FindCommentsPathParamsDTO,
  type FindCommentsResponseBodyDTO,
} from './schema/findCommentsSchema.js';
import {
  findPostsResponseBodyDTOSchema,
  type FindPostsResponseBodyDTO,
  type FindPostsPathParamsDTO,
} from './schema/findPostsSchema.js';
import { type PostDTO } from './schema/postDTO.js';
import {
  updateCommentPathParamsDTOSchema,
  updateCommentBodyDTOSchema,
  updateCommentResponseBodyDTOSchema,
  type UpdateCommentBodyDTO,
  type UpdateCommentPathParamsDTO,
  type UpdateCommentResponseBodyDTO,
} from './schema/updateCommentSchema.js';
import {
  updatePostBodyDTOSchema,
  updatePostPathParamsDTOSchema,
  updatePostResponseBodyDTOSchema,
  type UpdatePostBodyDTO,
  type UpdatePostPathParamsDTO,
  type UpdatePostResponseBodyDTO,
} from './schema/updatePostSchema.js';
import { type HttpController } from '../../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../../common/types/http/httpMethodName.js';
import { type HttpRequest } from '../../../../../common/types/http/httpRequest.js';
import {
  type HttpOkResponse,
  type HttpCreatedResponse,
  type HttpNoContentResponse,
} from '../../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../../common/types/http/httpStatusCode.js';
import { SecurityMode } from '../../../../../common/types/http/securityMode.js';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.js';
import { type CreateCommentCommandHandler } from '../../../application/commandHandlers/createCommentCommandHandler/createCommentCommandHandler.js';
import { type CreatePostCommandHandler } from '../../../application/commandHandlers/createPostCommandHandler/createPostCommandHandler.js';
import { type DeleteCommentCommandHandler } from '../../../application/commandHandlers/deleteCommentCommandHandler/deleteCommentCommandHandler.js';
import { type DeletePostCommandHandler } from '../../../application/commandHandlers/deletePostCommandHandler/deletePostCommandHandler.js';
import { type UpdateCommentCommandHandler } from '../../../application/commandHandlers/updateCommentCommandHandler/updateCommentCommandHandler.js';
import { type UpdatePostCommandHandler } from '../../../application/commandHandlers/updatePostCommandHandler/updatePostCommandHandler.js';
import { type FindCommentsQueryHandler } from '../../../application/queryHandlers/findCommentsQueryHandler/findCommentsQueryHandler.js';
import { type FindPostsQueryHandler } from '../../../application/queryHandlers/findPostsQueryHandler/findPostsQueryHandler.js';
import { type Comment } from '../../../domain/entities/comment/comment.js';
import { type Post } from '../../../domain/entities/post/post.js';

export class PostHttpController implements HttpController {
  public basePath = '/api/groups/:groupId/posts';
  public tags = ['Post'];

  public constructor(
    private readonly createPostCommandHandler: CreatePostCommandHandler,
    private readonly updatePostCommandHandler: UpdatePostCommandHandler,
    private readonly deletePostCommandHandler: DeletePostCommandHandler,
    private readonly findPostsQueryHandler: FindPostsQueryHandler,
    private readonly createCommentCommandHandler: CreateCommentCommandHandler,
    private readonly updateCommentCommandHandler: UpdateCommentCommandHandler,
    private readonly deleteCommentCommandHandler: DeleteCommentCommandHandler,
    private readonly findCommentsQueryHandler: FindCommentsQueryHandler,
    private readonly accessControlService: AccessControlService,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        description: 'Create post.',
        handler: this.createPost.bind(this),
        method: HttpMethodName.post,
        schema: {
          request: {
            body: createPostBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.created]: {
              description: 'Post created.',
              schema: createPostResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: 'Update Post content.',
        handler: this.updatePost.bind(this),
        method: HttpMethodName.patch,
        schema: {
          request: {
            pathParams: updatePostPathParamsDTOSchema,
            body: updatePostBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Post content updated.',
              schema: updatePostResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        path: ':postId',
      }),
      new HttpRoute({
        description: 'Delete post.',
        handler: this.deletePost.bind(this),
        method: HttpMethodName.delete,
        schema: {
          request: {
            pathParams: deletePostPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.noContent]: {
              description: 'Post deleted.',
              schema: deletePostResponseBodyDTOSchema,
            },
          },
        },
        path: ':postId',
      }),
      new HttpRoute({
        description: 'Find posts.',
        handler: this.findPosts.bind(this),
        method: HttpMethodName.get,
        schema: {
          request: {},
          response: {
            [HttpStatusCode.ok]: {
              description: 'Posts found.',
              schema: findPostsResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: `Create post's comment.`,
        method: HttpMethodName.post,
        path: ':postId/comments',
        handler: this.createComment.bind(this),
        schema: {
          request: {
            body: createCommentBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.created]: {
              description: `Post's comment created.`,
              schema: createCommentResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: `Find post's comments.`,
        method: HttpMethodName.get,
        path: ':postId/comments',
        handler: this.findComments.bind(this),
        schema: {
          request: {},
          response: {
            [HttpStatusCode.ok]: {
              description: `Post's comments found.`,
              schema: findCommentsResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: 'Update comment content.',
        handler: this.updateComment.bind(this),
        method: HttpMethodName.patch,
        schema: {
          request: {
            pathParams: updateCommentPathParamsDTOSchema,
            body: updateCommentBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Comment content updated.',
              schema: updateCommentResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        path: ':postId/comments/:commentId',
      }),
      new HttpRoute({
        description: 'Delete comment.',
        handler: this.deleteComment.bind(this),
        method: HttpMethodName.delete,
        schema: {
          request: {
            pathParams: deleteCommentPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.noContent]: {
              description: 'Comment deleted.',
              schema: deleteCommentResponseBodyDTOSchema,
            },
          },
        },
        path: ':postId/comments/:commentId',
      }),
    ];
  }

  private async createPost(
    request: HttpRequest<CreatePostBodyDTO, undefined, CreatePostPathParamsDTO>,
  ): Promise<HttpCreatedResponse<CreatePostResponseBodyDTO>> {
    const { userId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { groupId } = request.pathParams;

    const { content } = request.body;

    const { post } = await this.createPostCommandHandler.execute({
      userId,
      groupId,
      content,
    });

    return {
      body: this.mapPostToDTO(post),
      statusCode: HttpStatusCode.created,
    };
  }

  private async updatePost(
    request: HttpRequest<UpdatePostBodyDTO, null, UpdatePostPathParamsDTO>,
  ): Promise<HttpOkResponse<UpdatePostResponseBodyDTO>> {
    this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { postId } = request.pathParams;

    const { content } = request.body;

    const { post } = await this.updatePostCommandHandler.execute({
      id: postId,
      content,
    });

    return {
      body: this.mapPostToDTO(post),
      statusCode: HttpStatusCode.ok,
    };
  }

  private async deletePost(
    request: HttpRequest<null, null, DeletePostPathParamsDTO>,
  ): Promise<HttpNoContentResponse<DeletePostResponseBodyDTO>> {
    this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { postId } = request.pathParams;

    await this.deletePostCommandHandler.execute({ id: postId });

    return {
      statusCode: HttpStatusCode.noContent,
      body: null,
    };
  }

  // TODO: check if user is a member of this group
  private async findPosts(
    request: HttpRequest<undefined, undefined, FindPostsPathParamsDTO>,
  ): Promise<HttpOkResponse<FindPostsResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { groupId } = request.pathParams;

    const { posts } = await this.findPostsQueryHandler.execute({ groupId });

    return {
      body: {
        data: posts.map(this.mapPostToDTO),
      },
      statusCode: HttpStatusCode.ok,
    };
  }

  private mapPostToDTO(post: Post): PostDTO {
    return {
      id: post.getId(),
      groupId: post.getGroupId(),
      userId: post.getUserId(),
      content: post.getContent(),
      createdAt: post.getCreatedAt().toISOString(),
    };
  }

  private async createComment(
    request: HttpRequest<CreateCommentBodyDTO, undefined, CreateCommentPathParamsDTO>,
  ): Promise<HttpCreatedResponse<CreateCommentResponseBodyDTO>> {
    const { userId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { postId } = request.pathParams;

    const { content } = request.body;

    const { comment } = await this.createCommentCommandHandler.execute({
      userId,
      postId,
      content,
    });

    return {
      body: this.mapCommentToDTO(comment),
      statusCode: HttpStatusCode.created,
    };
  }

  private async updateComment(
    request: HttpRequest<UpdateCommentBodyDTO, null, UpdateCommentPathParamsDTO>,
  ): Promise<HttpOkResponse<UpdateCommentResponseBodyDTO>> {
    this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { commentId } = request.pathParams;

    const { content } = request.body;

    const { comment } = await this.updateCommentCommandHandler.execute({
      id: commentId,
      content,
    });

    return {
      body: this.mapCommentToDTO(comment),
      statusCode: HttpStatusCode.ok,
    };
  }

  private async deleteComment(
    request: HttpRequest<null, null, DeleteCommentPathParamsDTO>,
  ): Promise<HttpNoContentResponse<DeleteCommentResponseBodyDTO>> {
    this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { commentId } = request.pathParams;

    await this.deleteCommentCommandHandler.execute({ id: commentId });

    return {
      statusCode: HttpStatusCode.noContent,
      body: null,
    };
  }

  // TODO: check if user is a member of this group
  private async findComments(
    request: HttpRequest<undefined, undefined, FindCommentsPathParamsDTO>,
  ): Promise<HttpOkResponse<FindCommentsResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { postId } = request.pathParams;

    const { comments } = await this.findCommentsQueryHandler.execute({ postId });

    return {
      body: {
        data: comments.map(this.mapCommentToDTO),
      },
      statusCode: HttpStatusCode.ok,
    };
  }

  private mapCommentToDTO(comment: Comment): CommentDTO {
    return {
      id: comment.getId(),
      postId: comment.getPostId(),
      userId: comment.getUserId(),
      content: comment.getContent(),
      createdAt: comment.getCreatedAt().toISOString(),
    };
  }
}

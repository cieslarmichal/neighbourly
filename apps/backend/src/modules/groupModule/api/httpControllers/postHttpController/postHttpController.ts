import {
  createPostBodyDTOSchema,
  createPostResponseBodyDTOSchema,
  type CreatePostBodyDTO,
  type CreatePostResponseBodyDTO,
  type CreatePostPathParamsDTO,
} from './schema/createPostSchema.js';
import {
  deletePostPathParamsDTOSchema,
  deletePostResponseBodyDTOSchema,
  type DeletePostPathParamsDTO,
  type DeletePostResponseBodyDTO,
} from './schema/deletePostSchema.js';
import {
  findPostsResponseBodyDTOSchema,
  type FindPostsResponseBodyDTO,
  type FindPostsPathParamsDTO,
} from './schema/findPostsSchema.js';
import { type PostDTO } from './schema/postDTO.js';
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
import { type CreatePostCommandHandler } from '../../../application/commandHandlers/createPostCommandHandler/createPostCommandHandler.js';
import { type DeletePostCommandHandler } from '../../../application/commandHandlers/deletePostCommandHandler/deletePostCommandHandler.js';
import { type UpdatePostCommandHandler } from '../../../application/commandHandlers/updatePostCommandHandler/updatePostCommandHandler.js';
import { type FindPostsQueryHandler } from '../../../application/queryHandlers/findPostsQueryHandler/findPostsQueryHandler.js';
import { type Post } from '../../../domain/entities/post/post.js';

export class PostHttpController implements HttpController {
  public basePath = '/api/groups/:groupId/posts';
  public tags = ['Post'];

  public constructor(
    private readonly createPostCommandHandler: CreatePostCommandHandler,
    private readonly updatePostCommandHandler: UpdatePostCommandHandler,
    private readonly deletePostCommandHandler: DeletePostCommandHandler,
    private readonly findPostsQueryHandler: FindPostsQueryHandler,
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
        path: ':id/name',
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
        path: ':id',
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

    const { id } = request.pathParams;

    const { content } = request.body;

    const { post } = await this.updatePostCommandHandler.execute({
      id,
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

    const { id } = request.pathParams;

    await this.deletePostCommandHandler.execute({ id });

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
}

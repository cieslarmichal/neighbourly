import {
  type CreateGroupBodyDTO,
  type CreateGroupResponseBodyDTO,
  createGroupBodyDTOSchema,
  createGroupResponseBodyDTOSchema,
} from './schema/createGroupSchema.js';
import {
  type DeleteGroupPathParamsDTO,
  deleteGroupResponseBodyDTOSchema,
  deleteGroupPathParamsDTOSchema,
  type DeleteGroupResponseBodyDTO,
} from './schema/deleteGroupSchema.js';
import {
  findGroupByIdPathParamsDTOSchema,
  findGroupByIdResponseBodyDTOSchema,
  type FindGroupByIdPathParamsDTO,
  type FindGroupByIdResponseBodyDTO,
} from './schema/findGroupByIdSchema.js';
import {
  findGroupByNameQueryParamsDTOSchema,
  findGroupByNameResponseBodyDTOSchema,
  type FindGroupByNameQueryParamsDTO,
  type FindGroupByNameResponseBodyDTO,
} from './schema/findGroupByNameSchema.js';
import { findGroupsResponseBodyDTOSchema, type FindGroupsResponseBodyDTO } from './schema/findGroupsSchema.js';
import { type GroupDTO } from './schema/groupDTO.js';
import {
  type UpdateGroupNameBodyDTO,
  type UpdateGroupNameResponseBodyDTO,
  type UpdateGroupNamePathParamsDTO,
  updateGroupNameBodyDTOSchema,
  updateGroupNameResponseBodyDTOSchema,
  updateGroupNamePathParamsDTOSchema,
} from './schema/updateGroupNameSchema.js';
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
import { type CreateGroupCommandHandler } from '../../../application/commandHandlers/createGroupCommandHandler/createGroupCommandHandler.js';
import { type DeleteGroupCommandHandler } from '../../../application/commandHandlers/deleteGroupCommandHandler/deleteGroupCommandHandler.js';
import { type UpdateGroupNameCommandHandler } from '../../../application/commandHandlers/updateGroupNameCommandHandler/updateGroupNameCommandHandler.js';
import { type FindGroupByIdQueryHandler } from '../../../application/queryHandlers/findGroupByIdQueryHandler/findGroupByIdQueryHandler.js';
import { type FindGroupByNameQueryHandler } from '../../../application/queryHandlers/findGroupByNameQueryHandler/findGroupByNameQueryHandler.js';
import { type FindGroupsQueryHandler } from '../../../application/queryHandlers/findGroupsQueryHandler/findGroupsQueryHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export class GroupHttpController implements HttpController {
  public basePath = '/api/groups';
  public tags = ['Group'];

  public constructor(
    private readonly createGroupCommandHandler: CreateGroupCommandHandler,
    private readonly updateGroupNameCommandHandler: UpdateGroupNameCommandHandler,
    private readonly deleteGroupCommandHandler: DeleteGroupCommandHandler,
    private readonly findGroupsQueryHandler: FindGroupsQueryHandler,
    private readonly findGroupByNameQueryHandler: FindGroupByNameQueryHandler,
    private readonly findGroupByIdQueryHandler: FindGroupByIdQueryHandler,
    private readonly accessControlService: AccessControlService,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        description: 'Create group.',
        handler: this.createGroup.bind(this),
        method: HttpMethodName.post,
        schema: {
          request: {
            body: createGroupBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.created]: {
              description: 'Group created.',
              schema: createGroupResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.basicAuth,
        path: 'create',
      }),
      new HttpRoute({
        description: 'Update Group name.',
        handler: this.updateGroupName.bind(this),
        method: HttpMethodName.patch,
        schema: {
          request: {
            pathParams: updateGroupNamePathParamsDTOSchema,
            body: updateGroupNameBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Group name updated.',
              schema: updateGroupNameResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.basicAuth,
        path: ':id/name',
      }),
      new HttpRoute({
        description: 'Delete group.',
        handler: this.deleteGroup.bind(this),
        method: HttpMethodName.delete,
        schema: {
          request: {
            pathParams: deleteGroupPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.noContent]: {
              description: 'Group deleted.',
              schema: deleteGroupResponseBodyDTOSchema,
            },
          },
        },
        path: ':id',
      }),
      new HttpRoute({
        description: 'Find groups.',
        handler: this.findGroups.bind(this),
        method: HttpMethodName.get,
        schema: {
          request: {},
          response: {
            [HttpStatusCode.ok]: {
              description: 'Groups found.',
              schema: findGroupsResponseBodyDTOSchema,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: 'Find group by name.',
        handler: this.findGroupByName.bind(this),
        method: HttpMethodName.get,
        schema: {
          request: {
            queryParams: findGroupByNameQueryParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Group found.',
              schema: findGroupByNameResponseBodyDTOSchema,
            },
          },
        },
        path: '/name',
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: 'Find group by id.',
        handler: this.findGroupById.bind(this),
        method: HttpMethodName.get,
        schema: {
          request: {
            pathParams: findGroupByIdPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Group found.',
              schema: findGroupByIdResponseBodyDTOSchema,
            },
          },
        },
        path: ':id',
        securityMode: SecurityMode.bearerToken,
      }),
    ];
  }

  private async createGroup(
    request: HttpRequest<CreateGroupBodyDTO>,
  ): Promise<HttpCreatedResponse<CreateGroupResponseBodyDTO>> {
    this.accessControlService.verifyBasicAuth({
      authorizationHeader: request.headers['authorization'],
    });

    const { name, addressId } = request.body;

    const { group } = await this.createGroupCommandHandler.execute({
      name,
      addressId,
    });

    return {
      body: this.mapGroupToDTO(group),
      statusCode: HttpStatusCode.created,
    };
  }

  private async updateGroupName(
    request: HttpRequest<UpdateGroupNameBodyDTO, null, UpdateGroupNamePathParamsDTO>,
  ): Promise<HttpOkResponse<UpdateGroupNameResponseBodyDTO>> {
    this.accessControlService.verifyBasicAuth({
      authorizationHeader: request.headers['authorization'],
    });

    const { id } = request.pathParams;

    const { name } = request.body;

    const { group } = await this.updateGroupNameCommandHandler.execute({
      id,
      name,
    });

    return {
      body: this.mapGroupToDTO(group),
      statusCode: HttpStatusCode.ok,
    };
  }

  private async deleteGroup(
    request: HttpRequest<null, null, DeleteGroupPathParamsDTO>,
  ): Promise<HttpNoContentResponse<DeleteGroupResponseBodyDTO>> {
    this.accessControlService.verifyBasicAuth({
      authorizationHeader: request.headers['authorization'],
    });

    const { id } = request.pathParams;

    await this.deleteGroupCommandHandler.execute({ id });

    return {
      statusCode: HttpStatusCode.noContent,
      body: null,
    };
  }

  private async findGroups(request: HttpRequest): Promise<HttpOkResponse<FindGroupsResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { groups } = await this.findGroupsQueryHandler.execute();

    return {
      body: {
        data: groups.map(this.mapGroupToDTO),
      },
      statusCode: HttpStatusCode.ok,
    };
  }

  private async findGroupByName(
    request: HttpRequest<null, FindGroupByNameQueryParamsDTO>,
  ): Promise<HttpOkResponse<FindGroupByNameResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { name } = request.queryParams;

    const { group } = await this.findGroupByNameQueryHandler.execute({ name });

    return {
      body: this.mapGroupToDTO(group),
      statusCode: HttpStatusCode.ok,
    };
  }

  private async findGroupById(
    request: HttpRequest<null, null, FindGroupByIdPathParamsDTO>,
  ): Promise<HttpOkResponse<FindGroupByIdResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { id } = request.pathParams;

    const { group } = await this.findGroupByIdQueryHandler.execute({ id });

    return {
      body: this.mapGroupToDTO(group),
      statusCode: HttpStatusCode.ok,
    };
  }

  private mapGroupToDTO(group: Group): GroupDTO {
    return {
      id: group.getId(),
      name: group.getName(),
      addressId: group.getAddressId(),
    };
  }
}

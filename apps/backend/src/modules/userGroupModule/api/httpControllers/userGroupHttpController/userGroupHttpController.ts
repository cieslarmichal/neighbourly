import {
  createUserGroupBodyDTOSchema,
  createUserGroupResponseBodyDTOSchema,
  type CreateUserGroupBodyDTO,
  type CreateUserGroupResponseBodyDTO,
  type CreateUserGroupPathParamsDTO,
} from './schemas/createUserGroupSchema.js';
import {
  deleteUserGroupPathParamsDTOSchema,
  deleteUserGroupResponseBodyDTOSchema,
  type DeleteUserGroupPathParamsDTO,
  type DeleteUserGroupResponseBodyDTO,
} from './schemas/deleteUserGroupSchema.js';
import {
  type FindGroupsByUserIdPathParamsDTO,
  type FindGroupsByUserIdResponseBodyDTO,
  findGroupsByUserfIdResponseBodyDTOSchema,
  findGroupsByUserIdPathParamsDTOSchema,
} from './schemas/findGroupsByUserIdSchema.js';
import {
  type FindUsersByGroupIdPathParamsDTO,
  type FindUsersByGroupIdResponseBodyDTO,
} from './schemas/findUsersByGroupIdSchema.js';
import {
  updateUserGroupPathParamsDTOSchema,
  updateUserGroupBodyDTOSchema,
  updateUserGroupResponseDTOSchema,
  type UpdateUserGroupBodyDTO,
  type UpdateUserGroupPathParamsDTO,
  type UpdateUserGroupResponseDTOSchema,
} from './schemas/updateUserGroupSchema.js';
import { type UserGroupDTO } from './schemas/userGroupDTO.js';
import { type HttpController } from '../../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../../common/types/http/httpMethodName.js';
import { type HttpRequest } from '../../../../../common/types/http/httpRequest.js';
import {
  type HttpCreatedResponse,
  type HttpOkResponse,
  type HttpNoContentResponse,
} from '../../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../../common/types/http/httpStatusCode.js';
import { SecurityMode } from '../../../../../common/types/http/securityMode.js';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.js';
import { type GroupDTO } from '../../../../groupModule/api/httpControllers/groupHttpController/schema/groupDTO.js';
import { type Group } from '../../../../groupModule/domain/entities/group/group.js';
import { type UserDTO } from '../../../../userModule/api/httpControllers/userHttpController/schemas/userDTO.js';
import { type User } from '../../../../userModule/domain/entities/user/user.js';
import { type CreateUserGroupCommandHandler } from '../../../application/commandHandlers/createUserGroupCommandHandler/createUserGroupCommandHandler.js';
import { type DeleteUserGroupCommandHandler } from '../../../application/commandHandlers/deleteUserGroupCommandHandler/deleteUserGroupCommandHandler.js';
import { type UpdateUserGroupCommandHandler } from '../../../application/commandHandlers/updateUserGroupCommandHandler/updateUserGroupCommandHandler.js';
import { type FindGroupsByUserQueryHandler } from '../../../application/queryHandlers/findGroupsByUserQueryHandler/findGroupsByUserQueryHandler.js';
import { type FindUsersByGroupQueryHandler } from '../../../application/queryHandlers/findUsersByGroupQueryHandler/findUsersByGroupQueryHandler.js';
import { type UserGroup } from '../../../domain/entities/userGroup/userGroup.js';

export class UserGroupHttpController implements HttpController {
  public readonly basePath = '/api';
  public readonly tags = ['UserGroup'];

  public constructor(
    private readonly createUserGroupCommandHandler: CreateUserGroupCommandHandler,
    private readonly updateUserGroupCommandHandler: UpdateUserGroupCommandHandler,
    private readonly deleteUserGroupCommandHandler: DeleteUserGroupCommandHandler,
    private readonly findGroupsByUserQueryHandler: FindGroupsByUserQueryHandler,
    private readonly findUsersByGroupQueryHandler: FindUsersByGroupQueryHandler,
    private readonly accessControlService: AccessControlService,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'groups/:groupId/users',
        handler: this.createUserGroup.bind(this),
        schema: {
          request: {
            body: createUserGroupBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.created]: {
              schema: createUserGroupResponseBodyDTOSchema,
              description: 'UserGroup created.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        description: 'Create UserGroup.',
      }),
      new HttpRoute({
        method: HttpMethodName.get,
        path: '/users/:userId/groups',
        handler: this.findGroupsByUser.bind(this),
        description: 'Find groups by user id.',
        schema: {
          request: {
            pathParams: findGroupsByUserIdPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: findGroupsByUserfIdResponseBodyDTOSchema,
              description: 'Groups found.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        method: HttpMethodName.get,
        path: '/groups/:groupdId/users',
        handler: this.findUsersByGroup.bind(this),
        description: 'Find users by group id.',
        schema: {
          request: {
            pathParams: findGroupsByUserIdPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: findGroupsByUserfIdResponseBodyDTOSchema,
              description: 'Users found.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        method: HttpMethodName.delete,
        path: 'groups/:groupId/users/:userId',
        handler: this.deleteUserGroup.bind(this),
        schema: {
          request: {
            pathParams: deleteUserGroupPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.noContent]: {
              schema: deleteUserGroupResponseBodyDTOSchema,
              description: 'UserGroup deleted.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        description: 'Delete UserGroup.',
      }),
      new HttpRoute({
        method: HttpMethodName.patch,
        path: 'groups/:groupId/users/:userId',
        description: 'Update UserGroup.',
        handler: this.updateUserGroup.bind(this),
        schema: {
          request: {
            pathParams: updateUserGroupPathParamsDTOSchema,
            body: updateUserGroupBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'UserGroup updated.',
              schema: updateUserGroupResponseDTOSchema,
            },
          },
        },
      }),
    ];
  }

  private async updateUserGroup(
    request: HttpRequest<UpdateUserGroupBodyDTO, undefined, UpdateUserGroupPathParamsDTO>,
  ): Promise<HttpOkResponse<UpdateUserGroupResponseDTOSchema>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { groupId, userId } = request.pathParams;

    const { role } = request.body;

    const { userGroup } = await this.updateUserGroupCommandHandler.execute({
      groupId,
      userId,
      role,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: this.mapUserGroupToUserGroupDTO(userGroup),
    };
  }

  // TODO: check if the user is allowed to create UserGroup
  private async createUserGroup(
    request: HttpRequest<CreateUserGroupBodyDTO, undefined, CreateUserGroupPathParamsDTO>,
  ): Promise<HttpCreatedResponse<CreateUserGroupResponseBodyDTO>> {
    const { role } = request.body;

    const { groupId, userId } = request.pathParams;

    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { userGroup } = await this.createUserGroupCommandHandler.execute({
      groupId,
      userId,
      role,
    });

    return {
      statusCode: HttpStatusCode.created,
      body: this.mapUserGroupToUserGroupDTO(userGroup),
    };
  }

  private async findGroupsByUser(
    request: HttpRequest<undefined, undefined, FindGroupsByUserIdPathParamsDTO>,
  ): Promise<HttpOkResponse<FindGroupsByUserIdResponseBodyDTO>> {
    const { userId: tokenUserId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    console.log({ tokenUserId });

    const { userId } = request.pathParams;

    const { groups } = await this.findGroupsByUserQueryHandler.execute({ userId });

    return {
      body: {
        data: groups.map((group) => this.mapGroupToGroupDTO(group)),
      },
      statusCode: HttpStatusCode.ok,
    };
  }

  private async findUsersByGroup(
    request: HttpRequest<undefined, undefined, FindUsersByGroupIdPathParamsDTO>,
  ): Promise<HttpOkResponse<FindUsersByGroupIdResponseBodyDTO>> {
    const { userId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    console.log({ userId });

    const { groupId } = request.pathParams;

    const { users } = await this.findUsersByGroupQueryHandler.execute({ groupId });

    return {
      body: {
        data: users.map((user) => this.mapUserToUserDTO(user)),
      },
      statusCode: HttpStatusCode.ok,
    };
  }

  private async deleteUserGroup(
    request: HttpRequest<undefined, undefined, DeleteUserGroupPathParamsDTO>,
  ): Promise<HttpNoContentResponse<DeleteUserGroupResponseBodyDTO>> {
    const { groupId, userId } = request.pathParams;

    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    await this.deleteUserGroupCommandHandler.execute({
      groupId,
      userId,
    });

    return {
      statusCode: HttpStatusCode.noContent,
      body: null,
    };
  }

  private mapUserGroupToUserGroupDTO(userGroup: UserGroup): UserGroupDTO {
    return {
      id: userGroup.getId(),
      userId: userGroup.getUserId(),
      groupId: userGroup.getGroupId(),
      role: userGroup.getRole(),
    };
  }

  // TODO: move to common
  private mapUserToUserDTO(user: User): UserDTO {
    return {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      isEmailVerified: user.getIsEmailVerified(),
    };
  }

  private mapGroupToGroupDTO(group: Group): GroupDTO {
    return {
      id: group.getId(),
      name: group.getName(),
      addressId: group.getAddressId(),
    };
  }
}

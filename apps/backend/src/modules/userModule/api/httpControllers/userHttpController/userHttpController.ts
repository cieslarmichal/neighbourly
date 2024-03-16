import {
  type ChangeUserPasswordBodyDTO,
  type ChangeUserPasswordResponseBodyDTO,
  changeUserPasswordBodyDTOSchema,
  changeUserPasswordResponseBodyDTOSchema,
} from './schemas/changeUserPasswordSchema.js';
import {
  deleteUserResponseBodyDTOSchema,
  type DeleteUserResponseBodyDTO,
  type DeleteUserPathParamsDTO,
  deleteUserPathParamsDTOSchema,
} from './schemas/deleteUserSchema.js';
import { findMyUserResponseBodyDTOSchema } from './schemas/findMyUserSchema.js';
import {
  findUserPathParamsDTOSchema,
  findUserResponseBodyDTOSchema,
  type FindUserPathParamsDTO,
  type FindUserResponseBodyDTO,
} from './schemas/findUserSchema.js';
import {
  type LoginUserBodyDTO,
  type LoginUserResponseBodyDTO,
  loginUserBodyDTOSchema,
  loginUserResponseBodyDTOSchema,
} from './schemas/loginUserSchema.js';
import {
  logoutUserPathParamsDTOSchema,
  type LogoutUserBodyDTO,
  type LogoutUserPathParamsDTO,
  type LogoutUserResponseBodyDTO,
  logoutUserBodyDTOSchema,
  logoutUserResponseBodyDTOSchema,
} from './schemas/logoutUserSchema.js';
import {
  refreshUserTokensBodyDTOSchema,
  refreshUserTokensResponseBodyDTOSchema,
  type RefreshUserTokensBodyDTO,
  type RefreshUserTokensResponseBodyDTO,
} from './schemas/refreshUserTokensSchema.js';
import {
  registerUserBodyDTOSchema,
  registerUserResponseBodyDTOSchema,
  type RegisterUserResponseBodyDTO,
  type RegisterUserBodyDTO,
  registerUserBodyPreValidationHook,
} from './schemas/registerUserSchema.js';
import {
  type ResetUserPasswordBodyDTO,
  type ResetUserPasswordResponseBodyDTO,
  resetUserPasswordBodyDTOSchema,
  resetUserPasswordResponseBodyDTOSchema,
} from './schemas/resetUserPasswordSchema.js';
import {
  type SendVerificationEmailBodyDTO,
  type SendVerificationEmailResponseBodyDTO,
  sendVerificationEmailBodyDTOSchema,
  sendVerificationEmailResponseBodyDTOSchema,
} from './schemas/sendVerificationEmailSchema.js';
import { type UserDTO } from './schemas/userDTO.js';
import {
  verifyUserBodyDTOSchema,
  verifyUserResponseBodyDTOSchema,
  type VerifyUserBodyDTO,
  type VerifyUserResponseBodyDTO,
} from './schemas/verifyUserSchema.js';
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
import { type ChangeUserPasswordCommandHandler } from '../../../application/commandHandlers/changeUserPasswordCommandHandler/changeUserPasswordCommandHandler.js';
import { type DeleteUserCommandHandler } from '../../../application/commandHandlers/deleteUserCommandHandler/deleteUserCommandHandler.js';
import { type LoginUserCommandHandler } from '../../../application/commandHandlers/loginUserCommandHandler/loginUserCommandHandler.js';
import { type LogoutUserCommandHandler } from '../../../application/commandHandlers/logoutUserCommandHandler/logoutUserCommandHandler.js';
import { type RefreshUserTokensCommandHandler } from '../../../application/commandHandlers/refreshUserTokensCommandHandler/refreshUserTokensCommandHandler.js';
import { type RegisterUserCommandHandler } from '../../../application/commandHandlers/registerUserCommandHandler/registerUserCommandHandler.js';
import { type SendResetPasswordEmailCommandHandler } from '../../../application/commandHandlers/sendResetPasswordEmailCommandHandler/sendResetPasswordEmailCommandHandler.js';
import { type SendVerificationEmailCommandHandler } from '../../../application/commandHandlers/sendVerificationEmailCommandHandler/sendVerificationEmailCommandHandler.js';
import { type VerifyUserEmailCommandHandler } from '../../../application/commandHandlers/verifyUserEmailCommandHandler/verifyUserEmailCommandHandler.js';
import { type FindUserQueryHandler } from '../../../application/queryHandlers/findUserQueryHandler/findUserQueryHandler.js';
import { type User } from '../../../domain/entities/user/user.js';

export class UserHttpController implements HttpController {
  public readonly basePath = '/api/users';
  public readonly tags = ['User'];

  public constructor(
    private readonly registerUserCommandHandler: RegisterUserCommandHandler,
    private readonly loginUserCommandHandler: LoginUserCommandHandler,
    private readonly deleteUserCommandHandler: DeleteUserCommandHandler,
    private readonly findUserQueryHandler: FindUserQueryHandler,
    private readonly accessControlService: AccessControlService,
    private readonly verifyUserEmailCommandHandler: VerifyUserEmailCommandHandler,
    private readonly resetUserPasswordCommandHandler: SendResetPasswordEmailCommandHandler,
    private readonly changeUserPasswordCommandHandler: ChangeUserPasswordCommandHandler,
    private readonly logoutUserCommandHandler: LogoutUserCommandHandler,
    private readonly refreshUserTokensCommandHandler: RefreshUserTokensCommandHandler,
    private readonly sendVerificationEmailCommandHandler: SendVerificationEmailCommandHandler,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'register',
        handler: this.registerUser.bind(this),
        schema: {
          request: {
            body: registerUserBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.created]: {
              schema: registerUserResponseBodyDTOSchema,
              description: 'User registered.',
            },
          },
        },
        preValidation: registerUserBodyPreValidationHook,
        description: 'Register user.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'login',
        handler: this.loginUser.bind(this),
        schema: {
          request: {
            body: loginUserBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: loginUserResponseBodyDTOSchema,
              description: 'User logged in.',
            },
          },
        },
        description: 'Login user.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'reset-password',
        handler: this.resetUserPassword.bind(this),
        description: 'Reset user password.',
        schema: {
          request: {
            body: resetUserPasswordBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: resetUserPasswordResponseBodyDTOSchema,
              description: 'User password reset.',
            },
          },
        },
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'change-password',
        description: 'Change user password.',
        handler: this.changeUserPassword.bind(this),
        schema: {
          request: {
            body: changeUserPasswordBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: changeUserPasswordResponseBodyDTOSchema,
              description: 'User password changed.',
            },
          },
        },
      }),
      new HttpRoute({
        method: HttpMethodName.get,
        path: ':id',
        handler: this.findUser.bind(this),
        schema: {
          request: {
            pathParams: findUserPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: findUserResponseBodyDTOSchema,
              description: 'User found.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        description: 'Find user by id.',
      }),
      new HttpRoute({
        method: HttpMethodName.get,
        path: 'me',
        handler: this.findMyUser.bind(this),
        schema: {
          request: {},
          response: {
            [HttpStatusCode.ok]: {
              schema: findMyUserResponseBodyDTOSchema,
              description: 'User found.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        description: 'Find user by token.',
      }),
      new HttpRoute({
        method: HttpMethodName.delete,
        path: ':id',
        handler: this.deleteUser.bind(this),
        schema: {
          request: {
            pathParams: deleteUserPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.noContent]: {
              schema: deleteUserResponseBodyDTOSchema,
              description: 'User deleted.',
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        description: 'Delete user.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'send-verification-email',
        handler: this.sendVerificationEmail.bind(this),
        schema: {
          request: {
            body: sendVerificationEmailBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: sendVerificationEmailResponseBodyDTOSchema,
              description: 'Verification email sent.',
            },
          },
        },
        description: 'Send verification email.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'verify-email',
        handler: this.verifyUserEmail.bind(this),
        schema: {
          request: {
            body: verifyUserBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: verifyUserResponseBodyDTOSchema,
              description: `User's email verified.`,
            },
          },
        },
        description: 'Verify user email.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: ':id/logout',
        handler: this.logoutUser.bind(this),
        schema: {
          request: {
            pathParams: logoutUserPathParamsDTOSchema,
            body: logoutUserBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: logoutUserResponseBodyDTOSchema,
              description: `User logged out.`,
            },
          },
        },
        securityMode: SecurityMode.bearerToken,
        description: 'Logout user.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'token',
        handler: this.refreshUserTokens.bind(this),
        schema: {
          request: {
            body: refreshUserTokensBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: refreshUserTokensResponseBodyDTOSchema,
              description: 'User tokens refreshed.',
            },
          },
        },
        description: 'Refresh user tokens.',
      }),
    ];
  }

  private async registerUser(
    request: HttpRequest<RegisterUserBodyDTO>,
  ): Promise<HttpCreatedResponse<RegisterUserResponseBodyDTO>> {
    const { email, password, name } = request.body;

    const { user } = await this.registerUserCommandHandler.execute({
      email,
      password,
      name,
    });

    return {
      statusCode: HttpStatusCode.created,
      body: this.mapUserToUserDTO(user),
    };
  }

  private async loginUser(request: HttpRequest<LoginUserBodyDTO>): Promise<HttpOkResponse<LoginUserResponseBodyDTO>> {
    const { email, password } = request.body;

    const { accessToken, refreshToken, accessTokenExpiresIn } = await this.loginUserCommandHandler.execute({
      email,
      password,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: {
        accessToken,
        refreshToken,
        expiresIn: accessTokenExpiresIn,
      },
    };
  }

  private async resetUserPassword(
    request: HttpRequest<ResetUserPasswordBodyDTO, null, null>,
  ): Promise<HttpOkResponse<ResetUserPasswordResponseBodyDTO>> {
    const { email } = request.body;

    await this.resetUserPasswordCommandHandler.execute({
      email,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }

  private async changeUserPassword(
    request: HttpRequest<ChangeUserPasswordBodyDTO, null, null>,
  ): Promise<HttpOkResponse<ChangeUserPasswordResponseBodyDTO>> {
    const { password, token } = request.body;

    await this.changeUserPasswordCommandHandler.execute({
      newPassword: password,
      resetPasswordToken: token,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }

  private async findUser(
    request: HttpRequest<undefined, undefined, FindUserPathParamsDTO>,
  ): Promise<HttpOkResponse<FindUserResponseBodyDTO>> {
    const { id } = request.pathParams;

    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
      expectedUserId: id,
    });

    const { user } = await this.findUserQueryHandler.execute({ userId: id });

    return {
      statusCode: HttpStatusCode.ok,
      body: this.mapUserToUserDTO(user),
    };
  }

  private async findMyUser(request: HttpRequest): Promise<HttpOkResponse<FindUserResponseBodyDTO>> {
    const { userId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { user } = await this.findUserQueryHandler.execute({ userId });

    return {
      statusCode: HttpStatusCode.ok,
      body: this.mapUserToUserDTO(user),
    };
  }

  private async deleteUser(
    request: HttpRequest<undefined, undefined, DeleteUserPathParamsDTO>,
  ): Promise<HttpNoContentResponse<DeleteUserResponseBodyDTO>> {
    const { id } = request.pathParams;

    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
      expectedUserId: id,
    });

    await this.deleteUserCommandHandler.execute({ userId: id });

    return {
      statusCode: HttpStatusCode.noContent,
      body: null,
    };
  }

  private async verifyUserEmail(
    request: HttpRequest<VerifyUserBodyDTO, undefined, undefined>,
  ): Promise<HttpOkResponse<VerifyUserResponseBodyDTO>> {
    const { token } = request.body;

    await this.verifyUserEmailCommandHandler.execute({ emailVerificationToken: token });

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }

  private async sendVerificationEmail(
    request: HttpRequest<SendVerificationEmailBodyDTO, undefined, undefined>,
  ): Promise<HttpOkResponse<SendVerificationEmailResponseBodyDTO>> {
    const { email } = request.body;

    await this.sendVerificationEmailCommandHandler.execute({
      email: email.toLowerCase(),
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }

  private async logoutUser(
    request: HttpRequest<LogoutUserBodyDTO, undefined, LogoutUserPathParamsDTO>,
  ): Promise<HttpOkResponse<LogoutUserResponseBodyDTO>> {
    const { id } = request.pathParams;

    const { refreshToken, accessToken } = request.body;

    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
      expectedUserId: id,
    });

    await this.logoutUserCommandHandler.execute({
      userId: id,
      refreshToken,
      accessToken,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }

  private async refreshUserTokens(
    request: HttpRequest<RefreshUserTokensBodyDTO>,
  ): Promise<HttpOkResponse<RefreshUserTokensResponseBodyDTO>> {
    const { refreshToken: inputRefreshToken } = request.body;

    const { accessToken, refreshToken, accessTokenExpiresIn } = await this.refreshUserTokensCommandHandler.execute({
      refreshToken: inputRefreshToken,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: {
        accessToken,
        refreshToken,
        expiresIn: accessTokenExpiresIn,
      },
    };
  }

  private mapUserToUserDTO(user: User): UserDTO {
    return {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      isEmailVerified: user.getIsEmailVerified(),
    };
  }
}

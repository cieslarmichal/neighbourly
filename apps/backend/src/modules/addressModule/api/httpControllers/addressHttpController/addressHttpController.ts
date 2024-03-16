import {
  type CreateAddressBodyCreatedResponseDTO,
  createAddressBodyDTOSchema,
  createAddressCreatedResponseDTOSchema,
  type CreateAddressBodyDTO,
} from './schemas/createAddressSchema.js';
import {
  type FindAddressOkResponseBodyDTO,
  findAddressOkResponseBodyDTOSchema,
  findAddressPathParamsDTOSchema,
  type FindAddressPathParamsDTO,
} from './schemas/findAddressSchema.js';
import {
  type UpdateAddressOkResponseBodyDTO,
  updateAddressBodyDTOSchema,
  updateAddressOkResponseBodyDTOSchema,
  updateAddressPathParamsDTOSchema,
  type UpdateAddressBodyDTO,
  type UpdateAddressPathParamsDTO,
} from './schemas/updateAddressSchema.js';
import { type HttpController } from '../../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../../common/types/http/httpMethodName.js';
import { type HttpRequest } from '../../../../../common/types/http/httpRequest.js';
import { type HttpOkResponse, type HttpCreatedResponse } from '../../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../../common/types/http/httpStatusCode.js';
import { SecurityMode } from '../../../../../common/types/http/securityMode.js';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.js';
import { type CreateAddressCommandHandler } from '../../../application/commandHandlers/createAddressCommandHandler/createAddressCommandHandler.js';
import { type UpdateAddressCommandHandler } from '../../../application/commandHandlers/updateAddressCommandHandler/updateAddressCommandHandler.js';
import { type FindAddressByIdQueryHandler } from '../../../application/queryHandlers/findAddressByIdQueryHandler/findAddressByIdQueryHandler.js';
import { type Address } from '../../../domain/entities/address/address.js';

export class AddressHttpController implements HttpController {
  public basePath = '/api/address';
  public tags = ['Address'];

  public constructor(
    private readonly findAddressByIdQueryHandler: FindAddressByIdQueryHandler,
    private readonly createAddressCommandHandler: CreateAddressCommandHandler,
    private readonly updateAddressCommandHandler: UpdateAddressCommandHandler,
    private readonly accessControlService: AccessControlService,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        description: 'Create a new address.',
        handler: this.createAddress.bind(this),
        method: HttpMethodName.post,
        schema: {
          request: {
            body: createAddressBodyDTOSchema,
          },
          response: {
            [HttpStatusCode.created]: {
              description: 'Address created successfully.',
              schema: createAddressCreatedResponseDTOSchema,
            },
          },
        },
        path: '/',
      }),
      new HttpRoute({
        description: 'Update an address.',
        handler: this.updateAddress.bind(this),
        method: HttpMethodName.put,
        schema: {
          request: {
            body: updateAddressBodyDTOSchema,
            pathParams: updateAddressPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Address updated successfully.',
              schema: updateAddressOkResponseBodyDTOSchema,
            },
          },
        },
        path: '/:id',
        securityMode: SecurityMode.bearerToken,
      }),
      new HttpRoute({
        description: 'Find an address by id.',
        handler: this.findAddressById.bind(this),
        method: HttpMethodName.get,
        schema: {
          request: {
            pathParams: findAddressPathParamsDTOSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              description: 'Address found successfully.',
              schema: findAddressOkResponseBodyDTOSchema,
            },
          },
        },
        path: '/:id',
      }),
    ];
  }

  private async createAddress(
    request: HttpRequest<CreateAddressBodyDTO>,
  ): Promise<HttpCreatedResponse<CreateAddressBodyCreatedResponseDTO>> {
    const { latitude, longitude, groupId, userId, city, postalCode, street } = request.body;

    const createdAddress = await this.createAddressCommandHandler.execute({
      groupId,
      latitude,
      longitude,
      userId,
      city,
      postalCode,
      street,
    });

    return {
      statusCode: HttpStatusCode.created,
      body: this.mapToDto(createdAddress),
    };
  }

  private async updateAddress(
    request: HttpRequest<UpdateAddressBodyDTO, null, UpdateAddressPathParamsDTO>,
  ): Promise<HttpOkResponse<UpdateAddressOkResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { id } = request.pathParams;

    const { latitude, longitude } = request.body;

    const updatedAddress = await this.updateAddressCommandHandler.execute({
      id,
      latitude,
      longitude,
    });

    return {
      statusCode: HttpStatusCode.ok,
      body: this.mapToDto(updatedAddress),
    };
  }

  private async findAddressById(
    request: HttpRequest<null, null, FindAddressPathParamsDTO>,
  ): Promise<HttpOkResponse<FindAddressOkResponseBodyDTO>> {
    await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    const { id } = request.pathParams;

    const address = await this.findAddressByIdQueryHandler.execute({
      id,
    });

    if (address.getGroupId()) {
      // TODO
      // await this.accessControlService.verifyAccessToGroup({
      //   groupId: address.getGroupId() as string,
      //   authorizationHeader: request.headers['authorization'],
      // });
    }

    if (address.getUserId()) {
      await this.accessControlService.verifyBearerToken({
        authorizationHeader: request.headers['authorization'],
        expectedUserId: address.getUserId() as string,
      });
    }

    return {
      statusCode: HttpStatusCode.ok,
      body: this.mapToDto(address),
    };
  }

  private mapToDto(address: Address): FindAddressOkResponseBodyDTO {
    return {
      id: address.getId(),
      latitude: address.getLatitude(),
      longitude: address.getLongitude(),
      groupId: address.getGroupId() as string,
      userId: address.getUserId() as string,
      city: address.getCity(),
      postalCode: address.getPostalCode(),
      street: address.getStreet(),
    };
  }
}

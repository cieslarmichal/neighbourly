/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { type FastifyInstance, type FastifyReply, type FastifyRequest, type FastifySchema } from 'fastify';

import { BaseError } from '../../common/errors/baseError.js';
import { OperationNotValidError } from '../../common/errors/operationNotValidError.js';
import { ResourceAlreadyExistsError } from '../../common/errors/resourceAlreadyExistsError.js';
import { ResourceNotFoundError } from '../../common/errors/resourceNotFoundError.js';
import { type HttpController } from '../../common/types/http/httpController.js';
import { HttpHeader } from '../../common/types/http/httpHeader.js';
import { HttpMediaType } from '../../common/types/http/httpMediaType.js';
import { type HttpRouteSchema, type HttpRoute } from '../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../common/types/http/httpStatusCode.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { ForbiddenAccessError } from '../../modules/authModule/application/errors/forbiddenAccessError.js';
import { UnauthorizedAccessError } from '../../modules/authModule/application/errors/unathorizedAccessError.js';
import { coreSymbols } from '../symbols.js';

export interface RegisterControllersPayload {
  readonly controllers: HttpController[];
}

export interface RegisterRoutesPayload {
  readonly routes: HttpRoute[];
  readonly basePath: string;
  readonly tags: string[];
}

export interface NormalizePathPayload {
  readonly path: string;
}

export class HttpRouter {
  private readonly rootPath = '';
  private readonly loggerService: LoggerService;

  public constructor(
    private readonly server: FastifyInstance,
    private readonly container: DependencyInjectionContainer,
  ) {
    this.loggerService = this.container.get<LoggerService>(coreSymbols.loggerService);
  }

  public registerControllers(payload: RegisterControllersPayload): void {
    const { controllers } = payload;

    controllers.forEach((controller) => {
      const { basePath, tags } = controller;

      const routes = controller.getHttpRoutes();

      this.registerControllerRoutes({
        routes,
        basePath,
        tags,
      });
    });
  }

  private registerControllerRoutes(payload: RegisterRoutesPayload): void {
    const { routes, basePath, tags } = payload;

    routes.map((httpRoute) => {
      const { method, path: controllerPath, description, preValidation: preValidationHook, securityMode } = httpRoute;

      const path = this.normalizePath({ path: `/${this.rootPath}/${basePath}/${controllerPath}` });

      const handler = async (fastifyRequest: FastifyRequest, fastifyReply: FastifyReply): Promise<void> => {
        try {
          this.loggerService.debug({
            message: 'Received an HTTP request.',
            path: fastifyRequest.url,
            method,
            pathParams: fastifyRequest.params,
            queryParams: fastifyRequest.query,
            body: fastifyRequest.body,
            headers: fastifyRequest.headers,
          });

          const { statusCode, body: responseBody } = await httpRoute.handler({
            body: fastifyRequest.body,
            pathParams: fastifyRequest.params,
            queryParams: fastifyRequest.query,
            headers: fastifyRequest.headers as Record<string, string>,
          });

          fastifyReply.status(statusCode);

          if (responseBody) {
            fastifyReply.header(HttpHeader.contentType, HttpMediaType.applicationJson);

            fastifyReply.send(responseBody);
          } else {
            fastifyReply.send();
          }

          this.loggerService.info({
            message: 'Sent an HTTP response.',
            path: fastifyRequest.url,
            method,
            statusCode,
          });
        } catch (error) {
          this.loggerService.error({
            message: 'Caught an error in the HTTP router.',
            error,
            path: fastifyRequest.url,
            method,
            statusCode: fastifyReply.statusCode,
          });

          if (error instanceof BaseError) {
            const formattedError: Record<string, unknown> = {
              name: error.name,
              message: error.message,
              context: error.context,
            };

            if (error instanceof ResourceNotFoundError) {
              fastifyReply.status(HttpStatusCode.notFound).send({
                ...formattedError,
              });

              return;
            }

            if (error instanceof OperationNotValidError) {
              fastifyReply.status(HttpStatusCode.unprocessableEntity).send({
                ...formattedError,
              });

              return;
            }

            if (error instanceof ResourceAlreadyExistsError) {
              fastifyReply.status(HttpStatusCode.unprocessableEntity).send({
                ...formattedError,
              });

              return;
            }

            if (error instanceof UnauthorizedAccessError) {
              fastifyReply.status(HttpStatusCode.unauthorized).send({
                ...formattedError,
              });

              return;
            }

            if (error instanceof ForbiddenAccessError) {
              fastifyReply.status(HttpStatusCode.forbidden).send({
                ...formattedError,
              });

              return;
            }

            fastifyReply.status(HttpStatusCode.internalServerError).send({
              ...formattedError,
            });

            return;
          }

          fastifyReply.status(HttpStatusCode.internalServerError).send({
            name: 'InternalServerError',
            message: 'Internal server error',
          });
        }
      };

      this.server.route({
        method,
        url: path,
        handler,
        schema: {
          description,
          tags,
          ...this.mapToFastifySchema(httpRoute.schema),
          ...(securityMode ? { security: [{ [securityMode]: [] }] } : {}),
        },
        ...(preValidationHook
          ? {
              preValidation: (request, _reply, next): void => {
                preValidationHook(request);

                next();
              },
            }
          : undefined),
      });
    });
  }

  private mapToFastifySchema(routeSchema: HttpRouteSchema): FastifySchema {
    const { pathParams, queryParams, body } = routeSchema.request;

    const fastifySchema: FastifySchema = {};

    if (pathParams) {
      fastifySchema.params = pathParams;
    }

    if (queryParams) {
      fastifySchema.querystring = queryParams;
    }

    if (body) {
      fastifySchema.body = body;
    }

    fastifySchema.response = Object.entries(routeSchema.response).reduce((agg, [statusCode, statusCodeSchema]) => {
      const { schema, description } = statusCodeSchema;

      return {
        ...agg,
        [statusCode]: {
          ...schema,
          description,
        },
      };
    }, {});

    return fastifySchema;
  }

  private normalizePath(payload: NormalizePathPayload): string {
    const { path } = payload;

    const urlWithoutDoubleSlashes = path.replace(/(\/+)/g, '/');

    const urlWithoutTrailingSlash = urlWithoutDoubleSlashes.replace(/(\/)$/g, '');

    return urlWithoutTrailingSlash;
  }
}

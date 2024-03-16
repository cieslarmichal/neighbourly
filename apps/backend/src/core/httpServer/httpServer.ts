/* eslint-disable @typescript-eslint/no-explicit-any */

import { fastifyCors } from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { fastify, type FastifyInstance } from 'fastify';
import { type FastifySchemaValidationError } from 'fastify/types/schema.js';
import { type Server } from 'http';

import { InputNotValidError } from '../../common/errors/inputNotValidError.js';
import { type HttpController } from '../../common/types/http/httpController.js';
import { HttpStatusCode } from '../../common/types/http/httpStatusCode.js';
import { SecurityMode } from '../../common/types/http/securityMode.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type AddressHttpController } from '../../modules/addressModule/api/httpControllers/addressHttpController/addressHttpController.js';
import { addressSymbols } from '../../modules/addressModule/symbols.js';
import { type GroupHttpController } from '../../modules/groupModule/api/httpControllers/groupHttpController/groupHttpController.js';
import { type PostHttpController } from '../../modules/groupModule/api/httpControllers/postHttpController/postHttpController.js';
import { groupSymbols } from '../../modules/groupModule/symbols.js';
import { type UserGroupHttpController } from '../../modules/userGroupModule/api/httpControllers/userGroupHttpController/userGroupHttpController.js';
import { userGroupSymbols } from '../../modules/userGroupModule/symbols.js';
import { type UserHttpController } from '../../modules/userModule/api/httpControllers/userHttpController/userHttpController.js';
import { userSymbols } from '../../modules/userModule/symbols.js';
import { type ApplicationHttpController } from '../api/httpControllers/applicationHttpController/applicationHttpController.js';
import { type Config } from '../config.js';
import { HttpRouter } from '../httpRouter/httpRouter.js';
import { coreSymbols, symbols } from '../symbols.js';

export class HttpServer {
  public readonly fastifyInstance: FastifyInstance;
  private readonly httpRouter: HttpRouter;
  private readonly container: DependencyInjectionContainer;
  private readonly loggerService: LoggerService;
  private readonly config: Config;

  public constructor(container: DependencyInjectionContainer) {
    this.container = container;

    this.loggerService = this.container.get<LoggerService>(coreSymbols.loggerService);

    this.config = container.get<Config>(coreSymbols.config);

    this.fastifyInstance = fastify({ bodyLimit: 10 * 1024 * 1024 }).withTypeProvider<TypeBoxTypeProvider>();

    this.httpRouter = new HttpRouter(this.fastifyInstance, container);
  }

  private getControllers(): HttpController[] {
    return [
      this.container.get<UserHttpController>(userSymbols.userHttpController),
      this.container.get<ApplicationHttpController>(symbols.applicationHttpController),
      this.container.get<GroupHttpController>(groupSymbols.groupHttpController),
      this.container.get<UserGroupHttpController>(userGroupSymbols.userGroupHttpController),
      this.container.get<AddressHttpController>(addressSymbols.addressHttpController),
      this.container.get<PostHttpController>(groupSymbols.postHttpController),
    ];
  }

  public async start(): Promise<void> {
    const { host, port } = this.config.server;

    this.setupErrorHandler();

    await this.initSwagger();

    await this.fastifyInstance.register(fastifyHelmet);

    await this.fastifyInstance.register(fastifyCors, {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    });

    this.fastifyInstance.setSerializerCompiler(() => {
      return (data) => JSON.stringify(data);
    });

    this.addRequestPreprocessing();

    this.httpRouter.registerControllers({
      controllers: this.getControllers(),
    });

    await this.fastifyInstance.listen({
      port,
      host,
    });

    this.loggerService.info({
      message: 'HTTP Server started.',
      port,
      host,
    });
  }

  public getInternalServerInstance(): Server {
    return this.fastifyInstance.server;
  }

  private setupErrorHandler(): void {
    this.fastifyInstance.setSchemaErrorFormatter((errors, dataVar) => {
      const { instancePath, message } = errors[0] as FastifySchemaValidationError;

      return new InputNotValidError({
        reason: `${dataVar}${instancePath} ${message}`,
        value: undefined,
      });
    });

    this.fastifyInstance.setErrorHandler((error, request, reply) => {
      const formattedError = {
        name: error.name,
        message: error.message,
        ...(error as any)?.context,
      };

      if (error instanceof InputNotValidError) {
        reply.status(HttpStatusCode.badRequest).send({ ...formattedError });
      } else {
        reply.status(HttpStatusCode.internalServerError).send({ ...formattedError });
      }

      this.loggerService.error({
        message: 'Caught an error in the HTTP server.',
        error: {
          ...formattedError,
          stack: error.stack,
          cause: error.cause,
        },
        path: request.url,
        method: request.method,
        statusCode: reply.statusCode,
      });
    });
  }

  private async initSwagger(): Promise<void> {
    await this.fastifyInstance.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Backend API',
          version: '1.0.0',
        },
        components: {
          securitySchemes: {
            [SecurityMode.bearerToken]: {
              type: 'http',
              scheme: 'bearer',
            },
            [SecurityMode.basicAuth]: {
              type: 'http',
              scheme: 'basic',
            },
          },
        },
      },
    });

    await this.fastifyInstance.register(fastifySwaggerUi, {
      routePrefix: '/api/docs',
      uiConfig: {
        defaultModelRendering: 'model',
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
      },
      staticCSP: true,
    });

    this.loggerService.debug({
      message: 'OpenAPI documentation initialized.',
      path: '/api/docs',
    });
  }

  private addRequestPreprocessing(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.fastifyInstance.addHook('preValidation', (request, _reply, next) => {
      const body = request.body as Record<string, unknown>;

      this.trimStringProperties(body);

      next();
    });
  }

  private trimStringProperties(obj: Record<string, any>): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.trimStringProperties(obj[key]);
      }
    }
  }
}

import { checkHealthResponseBodySchema, type CheckHealthResponseBody } from './schemas/checkHealthSchema.js';
import { type HttpController } from '../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../common/types/http/httpMethodName.js';
import { type HttpOkResponse } from '../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../common/types/http/httpStatusCode.js';
import { type DatabaseClient } from '../../../../libs/database/clients/databaseClient/databaseClient.js';

export class ApplicationHttpController implements HttpController {
  public readonly basePath = '/health';
  public readonly tags = ['Health'];

  public constructor(private readonly databaseClient: DatabaseClient) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: HttpMethodName.get,
        handler: this.checkHealth.bind(this),
        schema: {
          request: {},
          response: {
            [HttpStatusCode.ok]: {
              schema: checkHealthResponseBodySchema,
              description: 'Application is healthy.',
            },
          },
        },
        description: 'Check application health.',
      }),
    ];
  }

  private async checkHealth(): Promise<HttpOkResponse<CheckHealthResponseBody>> {
    const isDatabaseHealthy = await this.checkDatabaseHealth();

    const isApplicationHealthy = isDatabaseHealthy;

    return {
      statusCode: HttpStatusCode.ok,
      body: {
        healthy: isApplicationHealthy,
        checks: [
          {
            name: 'Database',
            healthy: isDatabaseHealthy,
          },
        ],
      },
    };
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.databaseClient.raw('SELECT 1');

      return true;
    } catch (error) {
      return false;
    }
  }
}

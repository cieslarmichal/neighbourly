import { BaseApiError } from './types/baseApiError';

type RequestPayload = {
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  url: string;
  /**
   * Defaults to 'application/json'. Determines how the response will be parsed. \\
   * Currently only supports 'application/json' and 'text/plain'.
   */
  body?: Record<string, unknown>;
};

type GetRequestPayload = Omit<RequestPayload, 'body'>;

type HttpResponse<T> = BaseHttpResponse<T> | ErrorHttpResponse;

interface ErrorHttpResponse {
  body: BaseApiError;
  success: false;
  statusCode: number;
}

interface BaseHttpResponse<T> {
  body: T;
  success: true;
  statusCode: number;
}

/**
 * I can see a world where we have one instance of it and inject it into the components
 * and queryClient, but I`m unsure how to achieve that. \\
 * This should be fine for the time being.
 */

export class HttpService {
  private static readonly baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.neighbourly.com/api';

  public static async get<T = unknown>(payload: GetRequestPayload): Promise<HttpResponse<T>> {
    try {
      const { url, headers, queryParams } = payload;

      let requestUrl = `${this.baseUrl}${url}`;

      if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();

        requestUrl = `${requestUrl}?${queryString}`;
      }

      const response = await fetch(`${requestUrl}`, {
        headers: {
          ...headers,
          Accept: 'application/json',
        },
        method: 'GET',
      });

      const responseBodyText = await response.text();

      let responseBody = {};

      try {
        responseBody = JSON.parse(responseBodyText);
      } catch (error) {
        responseBody = {};
      }

      if (!response.ok) {
        return {
          body: responseBody as BaseApiError,
          success: false,
          statusCode: response.status,
        };
      }

      return {
        body: responseBody as T,
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      throw new (class extends Error {
        code: number;
        context: Record<string, string>;

        constructor() {
          super('Wewnętrzny błąd serwera. Spróbuj ponownie później.');

          this.code = 500;

          this.context = {
            message: 'Wewnętrzny błąd serwera. Spróbuj ponownie później.',
          };
        }
      })();
    }
  }

  public static async post<T = unknown>(payload: RequestPayload): Promise<HttpResponse<T>> {
    try {
      const { url, headers, body } = payload;

      const response = await fetch(`${this.baseUrl}${url}`, {
        headers: {
          ...headers,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      });

      const responseBodyText = await response.text();

      let responseBody = {};

      try {
        responseBody = JSON.parse(responseBodyText);
      } catch (error) {
        responseBody = {};
      }

      if (!response.ok) {
        return {
          body: responseBody as BaseApiError,
          success: false,
          statusCode: response.status,
        };
      }

      return {
        body: responseBody as T,
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      throw new (class extends Error {
        code: number;
        context: Record<string, string>;

        constructor() {
          super('Wewnętrzny błąd serwera. Spróbuj ponownie później.');

          this.code = 500;

          this.context = {
            message: 'Wewnętrzny błąd serwera. Spróbuj ponownie później.',
          };
        }
      })();
    }
  }
}

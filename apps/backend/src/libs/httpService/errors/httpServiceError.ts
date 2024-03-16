import { BaseError } from '../../../common/errors/baseError.js';

interface Context {
  readonly url: string;
  readonly method: string;
  readonly [key: string]: unknown;
}

export class HttpServiceError extends BaseError<Context> {
  public constructor(context: Context) {
    super('HttpServiceError', 'Http service error.', context);
  }
}

import { BaseError } from '../../../../common/errors/baseError.js';

interface Context {
  readonly reason: string;
  readonly [key: string]: unknown;
}

export class ForbiddenAccessError extends BaseError<Context> {
  public constructor(context: Context) {
    super('ForbiddenAccessError', 'No permissions to perform this action.', context);
  }
}

import { BaseError } from '../../../../common/errors/baseError.js';

interface Context {
  readonly reason?: string;
  readonly [key: string]: unknown;
}

export class UnauthorizedAccessError extends BaseError<Context> {
  public constructor(context: Context) {
    super('UnauthorizedAccessError', 'Not authorized to perform this action.', context);
  }
}

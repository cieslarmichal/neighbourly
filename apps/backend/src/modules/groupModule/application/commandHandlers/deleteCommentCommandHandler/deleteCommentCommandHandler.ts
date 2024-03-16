import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface DeleteCommentPayload {
  readonly id: string;
}

export type DeleteCommentCommandHandler = CommandHandler<DeleteCommentPayload, void>;

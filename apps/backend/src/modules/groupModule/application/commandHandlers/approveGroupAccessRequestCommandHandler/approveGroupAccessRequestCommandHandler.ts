import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface ApproveGroupAccessRequestPayload {
  readonly requestId: string;
}

export type ApproveGroupAccessRequestCommandHandler = CommandHandler<ApproveGroupAccessRequestPayload, void>;

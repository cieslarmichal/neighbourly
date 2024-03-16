import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface DeletePostPayload {
  readonly id: string;
}

export type DeletePostCommandHandler = CommandHandler<DeletePostPayload, void>;

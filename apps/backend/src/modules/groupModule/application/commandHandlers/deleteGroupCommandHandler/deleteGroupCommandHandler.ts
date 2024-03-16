import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface DeleteGroupPayload {
  id: string;
}

export type DeleteGroupCommandHandler = CommandHandler<DeleteGroupPayload, void>;

import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Address } from '../../../domain/entities/address/address.js';

export interface CreateAddressCommandHandlerPayload {
  longitude: number;
  latitude: number;
  userId?: string | undefined;
  groupId?: string | undefined;
}

export type CreateAddressCommandHandler = CommandHandler<CreateAddressCommandHandlerPayload, Address>;

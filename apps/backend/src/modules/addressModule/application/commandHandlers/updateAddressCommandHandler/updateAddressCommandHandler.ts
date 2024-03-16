import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Address } from '../../../domain/entities/address/address.js';

export interface UpdateAddressPayload {
  id: string;
  longitude?: number | undefined;
  latitude?: number | undefined;
}

export type UpdateAddressCommandHandler = CommandHandler<UpdateAddressPayload, Address>;

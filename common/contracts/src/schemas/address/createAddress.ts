import { type Address } from './address.js';

export interface CreateAddressBody {
  latitude: number;
  longitude: number;
  groupId?: string;
  userId?: string;
}

export interface CreateAddressCreatedResponseDTO extends Address {}

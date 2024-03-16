import { type Address } from './address.js';

export interface CreateAddressBody {
  latitude: number;
  longitude: number;
  groupId?: string;
  userId?: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface CreateAddressCreatedResponseDTO extends Address {}

import { type Address } from '../../entities/address/address.js';
import { type AddressState } from '../../entities/address/addressState.js';

export interface Where {
  id: string;
  groupId: string;
  userId: string;
}

export interface FindByIdPayload {
  id: string;
}

export type CreatePayload = Omit<AddressState, 'id'>;

export type UpdatePayload = {
  id: string;
  longitude?: number | undefined;
  latitude?: number | undefined;
};

export interface AddressRepository {
  findById(payload: FindByIdPayload): Promise<Address | null>;
  create(payload: CreatePayload): Promise<Address>;
  update(payload: UpdatePayload): Promise<Address>;
}

import { type Address } from './address.js';

export interface UpdateAddressPathParams {
  id: string;
}

export interface UpdateAddressBody {
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressOkResponseBody extends Address {}

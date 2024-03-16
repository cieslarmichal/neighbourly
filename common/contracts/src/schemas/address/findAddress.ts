import { type Address } from './address.js';

export interface FindAddressPathParam {
  id: string;
}

export interface FindAddressOkResponseBodyDTO extends Address {}

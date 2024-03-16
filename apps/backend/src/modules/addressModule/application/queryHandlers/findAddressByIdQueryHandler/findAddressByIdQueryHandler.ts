import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Address } from '../../../domain/entities/address/address.js';

export interface FindAddressByIdPayload {
  id: string;
}

export type FindAddressByIdQueryHandler = QueryHandler<FindAddressByIdPayload, Address>;

import { type Knex } from 'knex';

//eslint-disable-next-line
export type RawQuery<T = any> = Knex.Raw<T>;

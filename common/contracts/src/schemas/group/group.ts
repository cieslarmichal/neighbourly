import { type AccessType } from './accessType.js';

export interface Group {
  readonly id: string;
  readonly name: string;
  readonly accessType: AccessType;
}

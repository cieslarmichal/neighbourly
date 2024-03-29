import { type AccessType } from '@common/contracts';

export interface GroupRawEntity {
  readonly id: string;
  readonly name: string;
  readonly accessType: AccessType;
}

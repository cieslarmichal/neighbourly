import { type Static, Type } from '@sinclair/typebox';

import { AccessType } from '@common/contracts';

export const groupDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  accessType: Type.Enum(AccessType),
});

export type GroupDTO = Static<typeof groupDTO>;

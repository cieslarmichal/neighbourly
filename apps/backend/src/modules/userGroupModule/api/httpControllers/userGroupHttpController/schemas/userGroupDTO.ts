import { type Static, Type } from '@sinclair/typebox';

import * as contracts from '@common/contracts';

export const userGroupDTOSchema = Type.Object({
  id: Type.String(),
  role: Type.Enum(contracts.UserGroupRole),
  userId: Type.String(),
  groupId: Type.String(),
});

export type UserGroupDTO = Static<typeof userGroupDTOSchema>;

import { type Static, Type } from '@sinclair/typebox';

export const groupAccessRequestDTO = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  groupId: Type.String(),
  createdAt: Type.String(),
});

export type GroupAccessRequestDTO = Static<typeof groupAccessRequestDTO>;

import { type Static, Type } from '@sinclair/typebox';

export const postDTO = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  groupId: Type.String(),
  content: Type.String(),
  createdAt: Type.String(),
});

export type PostDTO = Static<typeof postDTO>;

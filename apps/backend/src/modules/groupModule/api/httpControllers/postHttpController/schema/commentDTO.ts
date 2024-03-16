import { type Static, Type } from '@sinclair/typebox';

export const commentDTO = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  postId: Type.String(),
  content: Type.String(),
  createdAt: Type.String(),
});

export type CommentDTO = Static<typeof commentDTO>;

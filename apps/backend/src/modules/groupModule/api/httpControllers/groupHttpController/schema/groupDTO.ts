import { type Static, Type } from '@sinclair/typebox';

export const groupDTO = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
  name: Type.String(),
});

export type GroupDTO = Static<typeof groupDTO>;

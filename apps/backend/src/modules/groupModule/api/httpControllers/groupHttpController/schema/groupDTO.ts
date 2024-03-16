import { type Static, Type } from '@sinclair/typebox';

export const groupDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  addressId: Type.String(),
});

export type GroupDTO = Static<typeof groupDTO>;

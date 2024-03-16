export interface AddressTableRawEntity {
  id: string;
  userId: string | null;
  groupId: string | null;
  point: string;
}

export interface AddressTableRawTransformedEntity {
  id: string;
  userId: string | null;
  groupId: string | null;
  latitude: number;
  longitude: number;
}

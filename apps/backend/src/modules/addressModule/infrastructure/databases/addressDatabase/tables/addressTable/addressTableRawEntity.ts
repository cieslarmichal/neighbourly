export interface AddressTableRawEntity {
  id: string;
  userId: string | null;
  groupId: string | null;
  point: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface AddressTableRawTransformedEntity {
  id: string;
  userId: string | null;
  groupId: string | null;
  latitude: number;
  longitude: number;
  street: string;
  city: string;
  postalCode: string;
}

export interface Address {
  id: string;
  latitude: number;
  longitude: number;
  groupId?: string;
  userId?: string;
  street: string;
  city: string;
  postalCode: string;
}

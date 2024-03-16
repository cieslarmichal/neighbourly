import { type AddressState } from './addressState.js';

export interface AddressProps {
  id: string;
  state: AddressState;
}

export class Address {
  private id: string;
  private state: AddressState;

  public constructor(props: AddressProps) {
    const { id, state } = props;

    this.id = id;

    this.state = state;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string | null {
    return this.state.userId;
  }

  public getGroupId(): string | null {
    return this.state.groupId;
  }

  public getLatitude(): number {
    return this.state.latitude;
  }

  public getLongitude(): number {
    return this.state.longitude;
  }

  public getStreet(): string {
    return this.state.street;
  }

  public getCity(): string {
    return this.state.city;
  }

  public getPostalCode(): string {
    return this.state.postalCode;
  }
}
